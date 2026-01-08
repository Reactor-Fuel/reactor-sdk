"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteExactIn = quoteExactIn;
const fuels_1 = require("fuels");
const ReactorPoolContract_1 = require("./contracts/ReactorPoolContract");
const scripts_1 = require("./scripts");
async function quoteExactIn(reactorPoolContractId, wallet, poolId, baseAssetId, quoteAssetId, amountIn, amountOutMin = '0', deadlineBlocks = 1000) {
    const reactorPool = new ReactorPoolContract_1.ReactorPoolContract(reactorPoolContractId, wallet);
    const provider = wallet.provider;
    let swapExactInScript = new scripts_1.SwapExactIn(wallet);
    swapExactInScript.provider = provider;
    swapExactInScript = swapExactInScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        },
    });
    const inputs = await wallet.getResourcesToSpend([
        {
            amount: amountIn,
            assetId: baseAssetId.bits,
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
        baseAssetId,
        quoteAssetId,
        {
            Address: {
                bits: wallet.address.b256Address
            }
        },
        amountIn,
        amountOutMin,
        '0',
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
    // 5. Dry run the transaction
    let quoteResult = "-1";
    const callResult = await provider.dryRun(assembledRequest);
    const receipts = callResult.receipts;
    receipts.forEach((receipt) => {
        if (receipt.type == fuels_1.ReceiptType.ReturnData) {
            quoteResult = new fuels_1.BN(receipt.data).toString();
        }
    });
    return quoteResult;
}
//# sourceMappingURL=quoteExactIn.js.map