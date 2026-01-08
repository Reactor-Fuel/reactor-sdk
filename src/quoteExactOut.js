"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteExactOut = quoteExactOut;
const fuels_1 = require("fuels");
const ReactorPoolContract_1 = require("./contracts/ReactorPoolContract");
const scripts_1 = require("./scripts");
async function quoteExactOut(reactorPoolContractId, wallet, poolId, tokenInId, tokenOutId, amountOut, amountInMax, deadlineBlocks = 1000) {
    const reactorPool = new ReactorPoolContract_1.ReactorPoolContract(reactorPoolContractId, wallet);
    const provider = wallet.provider;
    let swapExactOutScript = new scripts_1.SwapExactOut(wallet);
    swapExactOutScript.provider = provider;
    swapExactOutScript = swapExactOutScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        },
    });
    const inputs = await wallet.getResourcesToSpend([
        {
            amount: amountInMax,
            assetId: tokenInId.bits,
        }
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
                bits: wallet.address.b256Address
            }
        },
        amountOut,
        amountInMax,
        '0',
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
//# sourceMappingURL=quoteExactOut.js.map