import { Account, AssetId, BigNumberish, ScriptTransactionRequest } from 'fuels';

import { ReactorPoolContract } from './contracts/ReactorPoolContract';
import { numberToI64Input } from './signed_integers';
import { RemoveLiquidity } from './scripts';

export async function removeLiquidity(
    reactorPoolContractId: string,
    wallet: Account,
    poolId: [AssetId, AssetId, BigNumberish],
    tickLower: number,
    tickUpper: number,
    liquidity: BigNumberish,
    amountsMin: [BigNumberish, BigNumberish],
    reserveGas: BigNumberish = '150000',
) {
    const provider = wallet.provider;
    const reactorPool = new ReactorPoolContract(reactorPoolContractId, wallet);

    let removeLiquidityScript = new RemoveLiquidity(wallet);
    removeLiquidityScript.provider = provider;
    removeLiquidityScript = removeLiquidityScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        },
    });

// 1. Create a script transaction using the script binary
    const request = new ScriptTransactionRequest({
        gasLimit: 3_000_000,
        script: removeLiquidityScript.bytes,
    });

// 2. Instantiate the script main arguments
    const scriptArguments = [
        poolId,
        {
            Address: {
                bits: wallet.address.b256Address,
            },
        },
        numberToI64Input(tickLower),
        numberToI64Input(tickUpper),
        liquidity,
        amountsMin[0],
        amountsMin[1],
        (await provider.getBlockNumber()).add(1000).toString(),
    ];

    console.log(JSON.stringify(scriptArguments, null, 2));

// 3. Populate the script data and add the contract input and output
    request
        .setData(RemoveLiquidity.abi, scriptArguments)
        .addContractInputAndOutput(reactorPool.id)
        .addVariableOutputs(4);

// 4. Estimate and fund the transaction
    const { assembledRequest } = await provider.assembleTx({
        request,
        feePayerAccount: wallet,
        reserveGas: reserveGas,
    });

// 5. Send the transaction
    const tx = await wallet.sendTransaction(assembledRequest);
    return await tx.waitForResult();
}
