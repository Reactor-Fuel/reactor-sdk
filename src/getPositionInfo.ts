import { Account, AssetId, BigNumberish } from 'fuels';
import { ReactorPoolContract } from './contracts/ReactorPoolContract';
import { numberToI64Input } from './signed_integers';
import { FeeAmount } from './utils';

export async function getPositionInfo(
    reactorPoolContractId: string,
    owner: Account,
    tickLower: number,
    tickUpper: number,
    poolId: [string, string, FeeAmount],
) {
    const reactorPool = new ReactorPoolContract(reactorPoolContractId, owner);
    const { value: positionInfo } = await reactorPool.functions.position_info(
        [{ bits: poolId[0] }, { bits: poolId[1] }, poolId[2]],
        {
            Address: {
                bits: owner.address.b256Address,
            },
        },
        numberToI64Input(tickLower),
        numberToI64Input(tickUpper),
    ).dryRun();
    return positionInfo;
}