import { Account, AssetId, BigNumberish, ScriptTransactionRequest } from 'fuels';

import { ReactorPoolContract } from './contracts/ReactorPoolContract';
import { numberToI64Input } from './signed_integers';
import { CollectFees } from './scripts';

export async function collectFees(
    reactorPoolContractId: string,
    ownerWallet: Account,
    recipientWallet: Account,
    poolId: [AssetId, AssetId, BigNumberish],
    tickLower: number,
    tickUpper: number,
    amountsMax: [BigNumberish, BigNumberish],
    reserveGas: BigNumberish = '150000',
) {
    const provider = ownerWallet.provider;
    const reactorPool = new ReactorPoolContract(reactorPoolContractId, ownerWallet);

    let collectFeesScript = new CollectFees(ownerWallet);
    collectFeesScript.provider = provider;
    collectFeesScript = collectFeesScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        },
    });

// 1. Create a script transaction using the script binary
    const request = new ScriptTransactionRequest({
        gasLimit: 3_000_000,
        script: collectFeesScript.bytes,
    });

// 2. Instantiate the script main arguments
    const scriptArguments = [
        poolId,
        {
            Address: {
                bits: recipientWallet.address.b256Address,
            },
        },
        {
            Address: {
                bits: ownerWallet.address.b256Address,
            },
        },
        numberToI64Input(tickLower),
        numberToI64Input(tickUpper),
        amountsMax[0],
        amountsMax[1],
        (await provider.getBlockNumber()).add(1000).toString(),
    ];

    console.log(JSON.stringify(scriptArguments, null, 2));

// 3. Populate the script data and add the contract input and output
    request
        .setData(CollectFees.abi, scriptArguments)
        .addContractInputAndOutput(reactorPool.id)
        .addVariableOutputs(4);

// 4. Estimate and fund the transaction
    const { assembledRequest } = await provider.assembleTx({
        request,
        feePayerAccount: ownerWallet,
        reserveGas: reserveGas
    });

// 5. Send the transaction
    const tx = await ownerWallet.sendTransaction(assembledRequest);
    return await tx.waitForResult();
}
