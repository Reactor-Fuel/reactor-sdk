import { Account, AssetId, BigNumberish, BN, ReceiptType, ScriptTransactionRequest } from 'fuels';
import { ReactorPoolContract } from './contracts/ReactorPoolContract';
import { SwapExactOut } from './scripts';

export async function quoteExactOut(
    reactorPoolContractId: string,
    wallet: Account,
    poolId: [string, string, BigNumberish],
    tokenInAssetId: string,
    tokenOutAssetId: string,
    amountOut: BigNumberish,
    amountInMax: BigNumberish,
    sqrtPriceX96Limit: BigNumberish = '0',
    deadlineBlocks: number = 1000,
): Promise<BigNumberish> {
    const reactorPool = new ReactorPoolContract(reactorPoolContractId, wallet);
    const provider = wallet.provider;

    let swapExactOutScript = new SwapExactOut(wallet);
    swapExactOutScript.provider = provider;
    swapExactOutScript = swapExactOutScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        },
    });

    const inputs = await wallet.getResourcesToSpend([
        {
            amount: amountInMax,
            assetId: tokenInAssetId,
        },
    ]);

// 1. Create a script transaction using the script binary
    const request = new ScriptTransactionRequest({
        gasLimit: 3_000_000,
        script: swapExactOutScript.bytes,
    });

// 2. Instantiate the script main arguments
    const scriptArguments = [
        [{ bits: poolId[0] }, { bits: poolId[1] }, poolId[2]],
        { bits: tokenInAssetId },
        { bits: tokenOutAssetId },
        {
            Address: {
                bits: wallet.address.b256Address,
            },
        },
        amountOut,
        amountInMax,
        sqrtPriceX96Limit.toString(),
        (await provider.getBlockNumber()).add(deadlineBlocks).toString(),
    ];

// 3. Populate the script data and add the contract input and output
    request
        .setData(SwapExactOut.abi, scriptArguments)
        .addContractInputAndOutput(reactorPool.id)
        .addResources(inputs)
        .addVariableOutputs(4);

// 4. Estimate and fund the transaction
    const { assembledRequest } = await provider.assembleTx({
        request,
        feePayerAccount: wallet,
    });

// 5. Dry run the transaction

    let quoteResult = '-1';
    const callResult = await provider.dryRun(assembledRequest);
    const receipts = callResult.receipts;
    receipts.forEach((receipt) => {
        if (receipt.type == ReceiptType.ReturnData) {
            quoteResult = new BN(receipt.data).toString();
        }
    });

    return quoteResult;

}