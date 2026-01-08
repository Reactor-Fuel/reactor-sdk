"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLiquidity = removeLiquidity;
const fuels_1 = require("fuels");
const ReactorPoolContract_1 = require("./contracts/ReactorPoolContract");
const signed_integers_1 = require("./signed_integers");
const scripts_1 = require("./scripts");
async function removeLiquidity(reactorPoolContractId, wallet, poolId, tickLower, tickUpper, liquidity, amountsMin) {
    const provider = wallet.provider;
    const reactorPool = new ReactorPoolContract_1.ReactorPoolContract(reactorPoolContractId, wallet);
    let removeLiquidityScript = new scripts_1.RemoveLiquidity(wallet);
    removeLiquidityScript.provider = provider;
    removeLiquidityScript = removeLiquidityScript.setConfigurableConstants({
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
        script: removeLiquidityScript.bytes,
    });
    // 2. Instantiate the script main arguments
    const scriptArguments = [
        poolId,
        (0, signed_integers_1.numberToI64Input)(tickLower),
        (0, signed_integers_1.numberToI64Input)(tickUpper),
        liquidity,
        amountsMin[0],
        amountsMin[1],
        (await provider.getBlockNumber()).add(1000).toString(),
    ];
    console.log(JSON.stringify(scriptArguments, null, 2));
    // 3. Populate the script data and add the contract input and output
    request
        .setData(scripts_1.RemoveLiquidity.abi, scriptArguments)
        .addContractInputAndOutput(reactorPool.id)
        .addVariableOutputs(4);
    // 4. Estimate and fund the transaction
    const { assembledRequest } = await provider.assembleTx({
        request,
        feePayerAccount: wallet,
    });
    // 5. Send the transaction
    const tx = await wallet.sendTransaction(assembledRequest);
    return await tx.waitForResult();
}
//# sourceMappingURL=removeLiquidity.js.map