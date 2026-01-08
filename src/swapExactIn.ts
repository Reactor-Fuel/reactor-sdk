import { Account, BigNumberish, ScriptTransactionRequest } from 'fuels';
import { SwapExactIn } from './scripts';
import { ReactorPoolContract } from './contracts/ReactorPoolContract';

export async function swapExactIn(
    reactorPoolContractId: string,
    wallet: Account,
    poolId: [string, string, BigNumberish],
    tokenInId: string,
    tokenOutId: string,
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    sqrtPriceX96Limit: BigNumberish = '0',
    deadlineBlocks: number = 1000,
    reserveGas: BigNumberish = '250000'
) {
    const provider = wallet.provider;
    const reactorPool = new ReactorPoolContract(reactorPoolContractId, wallet);

    let swapExactInScript = new SwapExactIn(wallet);
    swapExactInScript.provider = provider;
    swapExactInScript = swapExactInScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        }
    });

    const inputs = await wallet.getResourcesToSpend([
        {
            amount: amountIn,
            assetId: tokenInId,
        },
    ]);

    const defaultTxParams = {
        gasLimit: 10000,
    };


// 1. Create a script transaction using the script binary
    const request = new ScriptTransactionRequest({
        ...defaultTxParams,
        gasLimit: 3_000_000,
        script: swapExactInScript.bytes,
    });

// 2. Instantiate the script main arguments
    const scriptArguments = [
        [{bits: poolId[0]},{bits: poolId[1]}, poolId[2]],
        {bits: tokenInId},
        {bits: tokenOutId},
        {
            Address: {
                bits: wallet.address.b256Address
            }
        },
        amountIn,
        amountOutMin,
        sqrtPriceX96Limit.toString(),
        (await provider.getBlockNumber()).add(deadlineBlocks).toString()
    ];

// 3. Populate the script data and add the contract input and output
    request
        .setData(SwapExactIn.abi, scriptArguments)
        .addContractInputAndOutput(reactorPool.id)
        .addResources(inputs)
        .addVariableOutputs(4);

// 4. Estimate and fund the transaction
    const {assembledRequest} = await provider.assembleTx({
        request,
        feePayerAccount: wallet,
        reserveGas: reserveGas,
    });

// 5. Send the transaction
    const tx = await wallet.sendTransaction(assembledRequest);
    return await tx.waitForResult();
}