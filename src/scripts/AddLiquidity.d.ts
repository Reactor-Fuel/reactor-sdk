import { Account, BigNumberish, BN, Script as __Script } from 'fuels';
import type { Enum } from "./common";
export type IdentityInput = Enum<{
    Address: AddressInput;
    ContractId: ContractIdInput;
}>;
export type IdentityOutput = Enum<{
    Address: AddressOutput;
    ContractId: ContractIdOutput;
}>;
export type MathErrorInput = Enum<{
    ZeroValue: [];
    TickSpacingError: [];
    ResultIsU64Max: [];
    TickRange: [];
    InvalidTick: I64Input;
    InvalidSqrtRatio: BigNumberish;
    DivisionByZero: [];
}>;
export type MathErrorOutput = Enum<{
    ZeroValue: [];
    TickSpacingError: [];
    ResultIsU64Max: [];
    TickRange: [];
    InvalidTick: I64Output;
    InvalidSqrtRatio: BN;
    DivisionByZero: [];
}>;
export type AddressInput = {
    bits: string;
};
export type AddressOutput = AddressInput;
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
export type AddLiquidityInputs = [pool_id: [AssetIdInput, AssetIdInput, BigNumberish], tick_lower: I64Input, tick_upper: I64Input, amount_0_desired: BigNumberish, amount_1_desired: BigNumberish, amount_0_min: BigNumberish, amount_1_min: BigNumberish, recipient: IdentityInput, deadline: BigNumberish];
export type AddLiquidityOutput = [[AssetIdOutput, AssetIdOutput, BN], AssetIdOutput, BN, BN];
export type AddLiquidityConfigurables = Partial<{
    REACTOR_POOL_CONTRACT_ID: ContractIdInput;
}>;
export declare class AddLiquidity extends __Script<AddLiquidityInputs, AddLiquidityOutput> {
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
            components?: undefined;
        } | {
            type: string;
            metadataTypeId: number;
            components: ({
                name: string;
                typeId: number;
            } | {
                name: string;
                typeId: string;
            })[];
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
//# sourceMappingURL=AddLiquidity.d.ts.map