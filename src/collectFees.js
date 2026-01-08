"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectFees = collectFees;
const fuels_1 = require("fuels");
const ReactorPoolContract_1 = require("./contracts/ReactorPoolContract");
const signed_integers_1 = require("./signed_integers");
const scripts_1 = require("./scripts");
async function collectFees(reactorPoolContractId, ownerWallet, recipientWallet, poolId, tickLower, tickUpper, amountsMax) {
    const provider = ownerWallet.provider;
    const reactorPool = new ReactorPoolContract_1.ReactorPoolContract(reactorPoolContractId, ownerWallet);
    let collectFeesScript = new scripts_1.CollectFees(ownerWallet);
    collectFeesScript.provider = provider;
    collectFeesScript = collectFeesScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        },
    });
    const defaultTxParams = {
        gasLimit: 10000,
    };
    // 1. Create a script transaction using the script binary
    const request = new fuels_1.ScriptTransactionRequest({
        ...defaultTxParams,
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
        (0, signed_integers_1.numberToI64Input)(tickLower),
        (0, signed_integers_1.numberToI64Input)(tickUpper),
        amountsMax[0],
        amountsMax[1],
        (await provider.getBlockNumber()).add(1000).toString(),
    ];
    console.log(JSON.stringify(scriptArguments, null, 2));
    // 3. Populate the script data and add the contract input and output
    request
        .setData(scripts_1.CollectFees.abi, scriptArguments)
        .addContractInputAndOutput(reactorPool.id)
        .addVariableOutputs(4);
    // 4. Estimate and fund the transaction
    const { assembledRequest } = await provider.assembleTx({
        request,
        feePayerAccount: ownerWallet,
    });
    // 5. Send the transaction
    const tx = await ownerWallet.sendTransaction(assembledRequest);
    return await tx.waitForResult();
}
//# sourceMappingURL=collectFees.js.map