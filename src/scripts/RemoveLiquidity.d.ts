import { Account, BigNumberish, BN, Script as __Script } from 'fuels';
export type AssetIdInput = {
    bits: string;
};
export type AssetIdOutput = AssetIdInput;
export type ContractIdInput = {
    bits: string;
};
export type ContractIdOutput = ContractIdInput;
export type I64Input = {
    underlying: BigNumberish;
};
export type I64Output = {
    underlying: BN;
};
export type RemoveLiquidityInputs = [pool_id: [AssetIdInput, AssetIdInput, BigNumberish], tick_lower: I64Input, tick_upper: I64Input, liquidity: BigNumberish, amount_0_min: BigNumberish, amount_1_min: BigNumberish, deadline: BigNumberish];
export type RemoveLiquidityOutput = [BN, BN];
export type RemoveLiquidityConfigurables = Partial<{
    REACTOR_POOL_CONTRACT_ID: ContractIdInput;
}>;
export declare class RemoveLiquidity extends __Script<RemoveLiquidityInputs, RemoveLiquidityOutput> {
    static readonly abi: {
        programType: string;
        specVersion: string;
        encodingVersion: string;
        concreteTypes: ({
            type: string;
            concreteTypeId: string;
            metadataTypeId: number;
        } | {
            type: string;
            concreteTypeId: string;
            metadataTypeId?: undefined;
        })[];
        metadataTypes: ({
            type: string;
            metadataTypeId: number;
            components: ({
                name: string;
                typeId: number;
            } | {
                name: string;
                typeId: string;
            })[];
        } | {
            type: string;
            metadataTypeId: number;
            components?: undefined;
        })[];
        functions: {
            inputs: {
                name: string;
                concreteTypeId: string;
            }[];
            name: string;
            output: string;
            attributes: null;
        }[];
        loggedTypes: {
            logId: string;
            concreteTypeId: string;
        }[];
        messagesTypes: never[];
        configurables: {
            name: string;
            concreteTypeId: string;
            offset: number;
        }[];
    };
    static readonly bytecode: Uint8Array<ArrayBufferLike>;
    constructor(wallet: Account);
}
//# sourceMappingURL=RemoveLiquidity.d.ts.map