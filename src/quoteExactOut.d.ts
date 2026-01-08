import { Account, AssetId, BigNumberish } from 'fuels';
export declare function quoteExactOut(reactorPoolContractId: string, wallet: Account, poolId: [AssetId, AssetId, BigNumberish], tokenInId: AssetId, tokenOutId: AssetId, amountOut: BigNumberish, amountInMax: BigNumberish, deadlineBlocks?: number): Promise<BigNumberish>;
//# sourceMappingURL=quoteExactOut.d.ts.map