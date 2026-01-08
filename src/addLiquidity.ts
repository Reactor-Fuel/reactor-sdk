import { Account, AssetId, BigNumberish, ScriptTransactionRequest } from 'fuels';

import { AddLiquidity, AssetIdInput } from './scripts/AddLiquidity';
import { ReactorPoolContract } from './contracts/ReactorPoolContract';
import { numberToI64Input } from './signed_integers';
import { CreatePoolWithLiquidity } from './scripts';
import { FeeAmount } from './utils';

export async function addLiquidity(
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

export async function createPoolWithLiquidity(
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
        {bits: poolId[0]},
        {bits: poolId[1]},
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