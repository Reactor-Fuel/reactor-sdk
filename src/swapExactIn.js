"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapExactIn = swapExactIn;
const fuels_1 = require("fuels");
const scripts_1 = require("./scripts");
const ReactorPoolContract_1 = require("./contracts/ReactorPoolContract");
async function swapExactIn(reactorPoolContractId, wallet, poolId, tokenInId, tokenOutId, amountIn, amountOutMin, sqrtPriceX96Limit = '0', deadlineBlocks = 1000) {
    const provider = wallet.provider;
    const reactorPool = new ReactorPoolContract_1.ReactorPoolContract(reactorPoolContractId, wallet);
    let swapExactInScript = new scripts_1.SwapExactIn(wallet);
    swapExactInScript.provider = provider;
    swapExactInScript = swapExactInScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        }
    });
    const inputs = await wallet.getResourcesToSpend([
        {
            amount: amountIn,
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
        script: swapExactInScript.bytes,
    });
    // 2. Instantiate the script main arguments
    const scriptArguments = [
        poolId,
        tokenInId,
        tokenOutId,
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
        .setData(scripts_1.SwapExactIn.abi, scriptArguments)
        .addContractInputAndOutput(reactorPool.id)
        .addResources(inputs)
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
//# sourceMappingURL=swapExactIn.js.map