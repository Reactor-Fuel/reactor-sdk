"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapExactOut = swapExactOut;
const fuels_1 = require("fuels");
const ReactorPoolContract_1 = require("./contracts/ReactorPoolContract");
const scripts_1 = require("./scripts/");
async function swapExactOut(reactorPoolContractId, creatorWallet, poolId, tokenInId, tokenOutId, amountOut, amountInMax, sqrtPriceX96Limit = '0', deadlineBlocks = 1000) {
    const reactorPool = new ReactorPoolContract_1.ReactorPoolContract(reactorPoolContractId, creatorWallet);
    const provider = creatorWallet.provider;
    let swapExactOutScript = new scripts_1.SwapExactOut(creatorWallet);
    swapExactOutScript.provider = provider;
    swapExactOutScript = swapExactOutScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        },
    });
    const inputs = await creatorWallet.getResourcesToSpend([
        {
            amount: amountInMax,
            assetId: tokenInId.bits,
        },
    ]);
    const defaultTxParams = {
        gasLimit: 10000,
    };
    // 1. Create a script transaction using the script binary
    const request = new fuels_1.ScriptTransactionRequest({
        ...defaultTxParams,
        gasLimit: 3_000_000,
        script: swapExactOutScript.bytes,
    });
    // 2. Instantiate the script main arguments
    const scriptArguments = [
        poolId,
        tokenInId,
        tokenOutId,
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
        .setData(scripts_1.SwapExactOut.abi, scriptArguments)
        .addContractInputAndOutput(reactorPool.id)
        .addResources(inputs)
        .addVariableOutputs(4);
    // 4. Estimate and fund the transaction
    const { assembledRequest } = await provider.assembleTx({
        request,
        feePayerAccount: creatorWallet,
    });
    // 5. Send the transaction
    const tx = await creatorWallet.sendTransaction(assembledRequest);
    return await tx.waitForResult();
}
//# sourceMappingURL=swapExactOut.js.map