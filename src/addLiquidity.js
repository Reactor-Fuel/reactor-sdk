"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLiquidity = addLiquidity;
exports.createPoolWithLiquidity = createPoolWithLiquidity;
const fuels_1 = require("fuels");
const AddLiquidity_1 = require("./scripts/AddLiquidity");
const ReactorPoolContract_1 = require("./contracts/ReactorPoolContract");
const signed_integers_1 = require("./signed_integers");
const scripts_1 = require("./scripts");
async function addLiquidity(reactorPoolContractId, wallet, poolId, tickLower, tickUpper, desiredAmounts, minAmounts, deadlineBlocks = 1000) {
    const provider = wallet.provider;
    const reactorPool = new ReactorPoolContract_1.ReactorPoolContract(reactorPoolContractId, wallet);
    let addLiquidityScript = new AddLiquidity_1.AddLiquidity(wallet);
    addLiquidityScript.provider = provider;
    addLiquidityScript = addLiquidityScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        },
    });
    const inputs = await wallet.getResourcesToSpend([
        {
            amount: desiredAmounts[0],
            assetId: poolId[0].bits,
        },
        {
            amount: desiredAmounts[1],
            assetId: poolId[1].bits,
        },
    ]);
    const defaultTxParams = {
        gasLimit: 10000,
    };
    // 1. Create a script transaction using the script binary
    const request = new fuels_1.ScriptTransactionRequest({
        ...defaultTxParams,
        gasLimit: 3_000_000,
        script: addLiquidityScript.bytes,
    });
    // 2. Instantiate the script main arguments
    const scriptArguments = [
        poolId,
        (0, signed_integers_1.numberToI64Input)(tickLower),
        (0, signed_integers_1.numberToI64Input)(tickUpper),
        desiredAmounts[0],
        desiredAmounts[1],
        minAmounts[0],
        minAmounts[1],
        {
            Address: {
                bits: wallet.address.b256Address,
            },
        },
        (await provider.getBlockNumber()).add(deadlineBlocks).toString(),
    ];
    // 3. Populate the script data and add the contract input and output
    request
        .setData(AddLiquidity_1.AddLiquidity.abi, scriptArguments)
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
async function createPoolWithLiquidity(reactorPoolContractId, wallet, poolId, initPriceSqrtX96, tickLower, tickUpper, amounts, deadlineBlocks) {
    const provider = wallet.provider;
    const reactorPool = new ReactorPoolContract_1.ReactorPoolContract(reactorPoolContractId, wallet);
    let createPoolWithLiquidityScript = new scripts_1.CreatePoolWithLiquidity(wallet);
    createPoolWithLiquidityScript.provider = provider;
    createPoolWithLiquidityScript = createPoolWithLiquidityScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        },
    });
    const inputs = await wallet.getResourcesToSpend([
        {
            amount: amounts[0],
            assetId: poolId[0].bits,
        },
        {
            amount: amounts[1],
            assetId: poolId[1].bits,
        },
    ]);
    const defaultTxParams = {
        gasLimit: 10000,
    };
    // 1. Create a script transaction using the script binary
    const request = new fuels_1.ScriptTransactionRequest({
        ...defaultTxParams,
        gasLimit: 3_000_000,
        script: createPoolWithLiquidityScript.bytes,
    });
    // 2. Instantiate the script main arguments
    const scriptArguments = [
        poolId[0],
        poolId[1],
        poolId[2],
        initPriceSqrtX96,
        (0, signed_integers_1.numberToI64Input)(tickLower),
        (0, signed_integers_1.numberToI64Input)(tickUpper),
        amounts[0],
        amounts[1],
        '0',
        '0',
        {
            Address: {
                bits: wallet.address.b256Address,
            },
        },
        (await provider.getBlockNumber()).add(deadlineBlocks).toString(),
    ];
    console.log(JSON.stringify(scriptArguments, null, 2), (initPriceSqrtX96 / 2 ** 96) ** 2 / 100);
    // 3. Populate the script data and add the contract input and output
    request
        .setData(scripts_1.CreatePoolWithLiquidity.abi, scriptArguments)
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
//# sourceMappingURL=addLiquidity.js.map