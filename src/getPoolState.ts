import { Account } from 'fuels';
import { ReactorPoolContract } from './contracts/ReactorPoolContract';
import { FeeAmount } from './utils';

export async function getPoolState(
    reactorPoolContractId: string,
    account: Account,
    poolId: [string, string, FeeAmount],
) {
    const reactorPool = new ReactorPoolContract(reactorPoolContractId, account);
    const { value: poolState } = await reactorPool.functions.pool_state([{ bits: poolId[0] }, { bits: poolId[1] }, poolId[2]]).dryRun();
    return poolState;
}