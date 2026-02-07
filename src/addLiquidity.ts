import { Account, BigNumberish, ScriptTransactionRequest } from 'fuels';

import { CreatePoolWithLiquidity, AddLiquidity } from './scripts';
import { ReactorPoolContract } from './contracts/ReactorPoolContract';
import { numberToI64Input } from './signed_integers';
import { encodeSqrtRatioX96, FeeAmount, getUsableTick, TICK_SPACINGS } from './utils';
import JSBI from 'jsbi';
import { TickMath } from './tickMath';

export async function addLiquidityDecimalized(
    reactorPoolContractId: string,
    wallet: Account,
    baseAssetId: string,
    quoteAssetId: string,
    baseDecimals: number,
    quoteDecimals: number,
    baseAmount: number,
    quoteAmount: number,
    feeTier: FeeAmount,
    priceLower: number,
    priceUpper: number,
    baseAmountMin: number,
    quoteAmountMin: number,
    deadlineBlocks: number = 1000,
) {
    const baseAmountNoDecimals = baseAmount * (10 ** baseDecimals);
    const quoteAmountNoDecimals = quoteAmount * (10 ** quoteDecimals);
    const baseAmountMinNoDecimals = baseAmountMin * (10 ** baseDecimals);
    const quoteAmountMinNoDecimals = quoteAmountMin * (10 ** quoteDecimals);

    const poolId: [string, string, FeeAmount] = [baseAssetId, quoteAssetId, feeTier];

    let decimalsDelta = quoteDecimals - baseDecimals;
    const priceLowerNoDecimals = priceLower * (10 ** decimalsDelta);
    const priceUpperNoDecimals = priceUpper * (10 ** decimalsDelta);

    const priceLowerSqrtX96 = encodeSqrtRatioX96(JSBI.BigInt(priceLowerNoDecimals), JSBI.BigInt(1));
    const priceUpperSqrtX96 = encodeSqrtRatioX96(JSBI.BigInt(priceUpperNoDecimals), JSBI.BigInt(1));

    const tickLower = getUsableTick(TickMath.getTickAtSqrtRatio(priceLowerSqrtX96), TICK_SPACINGS[feeTier]);
    const tickUpper = getUsableTick(TickMath.getTickAtSqrtRatio(priceUpperSqrtX96), TICK_SPACINGS[feeTier]);

    return await addLiquidityNonDecimalized(
        reactorPoolContractId,
        wallet,
        poolId,
        tickLower,
        tickUpper,
        [baseAmountNoDecimals, quoteAmountNoDecimals],
        [baseAmountMinNoDecimals, quoteAmountMinNoDecimals],
        deadlineBlocks,
    );
}

export async function addLiquidityNonDecimalized(
    reactorPoolContractId: string,
    wallet: Account,
    poolId: [string, string, FeeAmount],
    tickLower: number,
    tickUpper: number,
    desiredAmounts: [BigNumberish, BigNumberish],
    minAmounts: [BigNumberish, BigNumberish],
    deadlineBlocks: number = 1000,
) {
    const provider = wallet.provider;
    const reactorPool = new ReactorPoolContract(reactorPoolContractId, wallet);

    let addLiquidityScript = new AddLiquidity(wallet);
    addLiquidityScript.provider = provider;
    addLiquidityScript = addLiquidityScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        },
    });

    const inputs = await wallet.getResourcesToSpend([
        {
            amount: desiredAmounts[0],
            assetId: poolId[0],
        },
        {
            amount: desiredAmounts[1],
            assetId: poolId[1],
        },
    ]);

    const defaultTxParams = {
        gasLimit: 10000,
    };

// 1. Create a script transaction using the script binary
    const request = new ScriptTransactionRequest({
        ...defaultTxParams,
        gasLimit: 3_000_000,
        script: addLiquidityScript.bytes,
    });

// 2. Instantiate the script main arguments
    const scriptArguments = [
        [{ bits: poolId[0] }, { bits: poolId[1] }, poolId[2]],
        numberToI64Input(tickLower),
        numberToI64Input(tickUpper),
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
        .setData(AddLiquidity.abi, scriptArguments)
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

export async function createPoolWithLiquidityDecimalized(
    reactorPoolContractId: string,
    wallet: Account,
    baseAssetId: string,
    quoteAssetId: string,
    baseDecimals: number,
    quoteDecimals: number,
    baseAmount: number,
    quoteAmount: number,
    feeTier: FeeAmount,
    priceLower: number,
    priceUpper: number,
    deadlineBlocks: number,
) {
    const baseAmountNoDecimals = baseAmount * (10 ** baseDecimals);
    const quoteAmountNoDecimals = quoteAmount * (10 ** quoteDecimals);
    const initPriceSqrtX96 = encodeSqrtRatioX96(JSBI.BigInt(quoteAmountNoDecimals.toString()), JSBI.BigInt(baseAmountNoDecimals.toString()));
    const poolId: [string, string, BigNumberish] = [baseAssetId, quoteAssetId, feeTier];

    const decimalsDelta = quoteDecimals - baseDecimals;
    const priceLowerNoDecimals = priceLower * (10 ** decimalsDelta);
    const priceUpperNoDecimals = priceUpper * (10 ** decimalsDelta);

    const priceLowerSqrtX96 = encodeSqrtRatioX96(JSBI.BigInt(priceLowerNoDecimals), JSBI.BigInt(1));
    const priceUpperSqrtX96 = encodeSqrtRatioX96(JSBI.BigInt(priceUpperNoDecimals), JSBI.BigInt(1));

    const tickLower = getUsableTick(TickMath.getTickAtSqrtRatio(priceLowerSqrtX96), TICK_SPACINGS[feeTier]);
    const tickUpper = getUsableTick(TickMath.getTickAtSqrtRatio(priceUpperSqrtX96), TICK_SPACINGS[feeTier]);

    const tickInitial = getUsableTick(TickMath.getTickAtSqrtRatio(initPriceSqrtX96), TICK_SPACINGS[feeTier]);

    if (tickInitial < tickLower || tickInitial > tickUpper) {
        throw Error(`initial tick: ${tickInitial} not in range [${tickLower}, ${tickUpper}]`);
    } else {
        return await createPoolWithLiquidityNonDecimalized(
            reactorPoolContractId,
            wallet,
            poolId,
            initPriceSqrtX96.toString(),
            tickLower,
            tickUpper,
            [baseAmountNoDecimals, quoteAmountNoDecimals],
            deadlineBlocks,
        );
    }
}

export async function createPoolWithLiquidityNonDecimalized(
    reactorPoolContractId: string,
    wallet: Account,
    poolId: [string, string, BigNumberish],
    initPriceSqrtX96: BigNumberish,
    tickLower: number,
    tickUpper: number,
    amounts: [BigNumberish, BigNumberish],
    deadlineBlocks: number,
    reserveGas: BigNumberish = '150000',
) {
    const provider = wallet.provider;
    const reactorPool = new ReactorPoolContract(reactorPoolContractId, wallet);

    let createPoolWithLiquidityScript = new CreatePoolWithLiquidity(wallet);
    createPoolWithLiquidityScript.provider = provider;
    createPoolWithLiquidityScript = createPoolWithLiquidityScript.setConfigurableConstants({
        REACTOR_POOL_CONTRACT_ID: {
            bits: reactorPoolContractId,
        },
    });

    const inputs = await wallet.getResourcesToSpend([
        {
            amount: amounts[0],
            assetId: poolId[0],
        },
        {
            amount: amounts[1],
            assetId: poolId[1],
        },
    ]);

// 1. Create a script transaction using the script binary
    const request = new ScriptTransactionRequest({
        gasLimit: 3_000_000,
        script: createPoolWithLiquidityScript.bytes,
    });

// 2. Instantiate the script main arguments
    const scriptArguments = [
        { bits: poolId[0] },
        { bits: poolId[1] },
        poolId[2],
        initPriceSqrtX96,
        numberToI64Input(tickLower),
        numberToI64Input(tickUpper),
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

    console.log(JSON.stringify(scriptArguments, null, 2), (initPriceSqrtX96 as any / 2 ** 96) ** 2 / 100);

// 3. Populate the script data and add the contract input and output
    request
        .setData(CreatePoolWithLiquidity.abi, scriptArguments)
        .addContractInputAndOutput(reactorPool.id)
        .addResources(inputs)
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