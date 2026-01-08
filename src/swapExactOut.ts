import { Account, AssetId, BigNumberish, ScriptTransactionRequest } from 'fuels';
import { ReactorPoolContract } from './contracts/ReactorPoolContract';
import { SwapExactOut } from './scripts/';

export async function swapExactOut(
    reactorPoolContractId: string,
    creatorWallet: Account,
    poolId: [string, string, BigNumberish],
    tokenInId: string,
    tokenOutId: string,
    amountOut: BigNumberish,
    amountInMax: BigNumberish,
    sqrtPriceX96Limit: BigNumberish = '0',
    deadlineBlocks: number = 1000,
    reserveGas: BigNumberish = '250000'
) {
    const reactorPool = new ReactorPoolContract(reactorPoolContractId, creatorWallet);
    const provider = creatorWallet.provider;

    let swapExactOutScript = new SwapExactOut(creatorWallet);
    swapExactOutScript.provider = provider;
    swapExactOutScript = swapExactOutScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        },
    });

    const inputs = await creatorWallet.getResourcesToSpend([
        {
            amount: amountInMax,
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
        script: swapExactOutScript.bytes,
    });

// 2. Instantiate the script main arguments
    const scriptArguments = [
        [{bits: poolId[0]},{bits: poolId[1]}, poolId[2]],
        {bits: tokenInId},
        {bits: tokenOutId},
        {
            Address: {
                bits: creatorWallet.address.b256Address
            }
        },
        amountOut,
        amountInMax,
        sqrtPriceX96Limit.toString(),
        (await provider.getBlockNumber()).add(deadlineBlocks).toString()
    ];

// 3. Populate the script data and add the contract input and output
    request
        .setData(SwapExactOut.abi, scriptArguments)
        .addContractInputAndOutput(reactorPool.id)
        .addResources(inputs)
        .addVariableOutputs(4);

// 4. Estimate and fund the transaction
    const {assembledRequest} = await provider.assembleTx({
        request,
        feePayerAccount: creatorWallet,
        reserveGas: reserveGas,
    });

// 5. Send the transaction
    const tx = await creatorWallet.sendTransaction(assembledRequest);
    return await tx.waitForResult();
}