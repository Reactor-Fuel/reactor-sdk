import { Contract as __Contract, Interface } from "fuels";
import type { Provider, Account, StorageSlot, Address, BigNumberish, BN, FunctionFragment, InvokeFunction, StdString } from 'fuels';
import type { Option, Enum } from "./common";
export declare enum AccessErrorInput {
    NotOwner = "NotOwner"
}
export declare enum AccessErrorOutput {
    NotOwner = "NotOwner"
}
export declare enum ErrorInput {
    ZeroDivisor = "ZeroDivisor"
}
export declare enum ErrorOutput {
    ZeroDivisor = "ZeroDivisor"
}
export type IdentityInput = Enum<{
    Address: AddressInput;
    ContractId: ContractIdInput;
}>;
export type IdentityOutput = Enum<{
    Address: AddressOutput;
    ContractId: ContractIdOutput;
}>;
export declare enum InitializationErrorInput {
    CannotReinitialized = "CannotReinitialized"
}
export declare enum InitializationErrorOutput {
    CannotReinitialized = "CannotReinitialized"
}
export type InputErrorInput = Enum<{
    PoolAlreadyExists: [AssetIdInput, AssetIdInput, BigNumberish];
    PoolDoesNotExist: [AssetIdInput, AssetIdInput, BigNumberish];
    InvalidAsset: AssetIdInput;
    IdenticalAssets: undefined;
    UnsortedAssetPair: undefined;
    PoolInvariantViolation: [];
    AssetSymbolNotSet: AssetIdInput;
    AssetDecimalsNotSet: AssetIdInput;
}>;
export type InputErrorOutput = Enum<{
    PoolAlreadyExists: [AssetIdOutput, AssetIdOutput, BN];
    PoolDoesNotExist: [AssetIdOutput, AssetIdOutput, BN];
    InvalidAsset: AssetIdOutput;
    IdenticalAssets: void;
    UnsortedAssetPair: void;
    PoolInvariantViolation: [];
    AssetSymbolNotSet: AssetIdOutput;
    AssetDecimalsNotSet: AssetIdOutput;
}>;
export type MathErrorInput = Enum<{
    ZeroValue: undefined;
    TickSpacingError: undefined;
    ResultIsU64Max: undefined;
    TickRange: undefined;
    InvalidTick: I64Input;
    InvalidSqrtRatio: BigNumberish;
    DivisionByZero: undefined;
}>;
export type MathErrorOutput = Enum<{
    ZeroValue: void;
    TickSpacingError: void;
    ResultIsU64Max: void;
    TickRange: void;
    InvalidTick: I64Output;
    InvalidSqrtRatio: BN;
    DivisionByZero: void;
}>;
export declare enum PauseErrorInput {
    Paused = "Paused",
    NotPaused = "NotPaused"
}
export declare enum PauseErrorOutput {
    Paused = "Paused",
    NotPaused = "NotPaused"
}
export declare enum ReentrancyErrorInput {
    NonReentrant = "NonReentrant"
}
export declare enum ReentrancyErrorOutput {
    NonReentrant = "NonReentrant"
}
export type StateInput = Enum<{
    Uninitialized: undefined;
    Initialized: IdentityInput;
    Revoked: undefined;
}>;
export type StateOutput = Enum<{
    Uninitialized: void;
    Initialized: IdentityOutput;
    Revoked: void;
}>;
export type AddressInput = {
    bits: string;
};
export type AddressOutput = AddressInput;
export type AssetIdInput = {
    bits: string;
};
export type AssetIdOutput = AssetIdInput;
export type BurnEventInput = {
    pool_id: [AssetIdInput, AssetIdInput, BigNumberish];
    recipient: IdentityInput;
    liquidity: BigNumberish;
    tick_lower: I64Input;
    tick_upper: I64Input;
    amount_0_actual: BigNumberish;
    amount_1_actual: BigNumberish;
};
export type BurnEventOutput = {
    pool_id: [AssetIdOutput, AssetIdOutput, BN];
    recipient: IdentityOutput;
    liquidity: BN;
    tick_lower: I64Output;
    tick_upper: I64Output;
    amount_0_actual: BN;
    amount_1_actual: BN;
};
export type CollectEventInput = {
    pool_id: [AssetIdInput, AssetIdInput, BigNumberish];
    position_owner: IdentityInput;
    recipient: IdentityInput;
    tick_lower: I64Input;
    tick_upper: I64Input;
    amount_0: BigNumberish;
    amount_1: BigNumberish;
};
export type CollectEventOutput = {
    pool_id: [AssetIdOutput, AssetIdOutput, BN];
    position_owner: IdentityOutput;
    recipient: IdentityOutput;
    tick_lower: I64Output;
    tick_upper: I64Output;
    amount_0: BN;
    amount_1: BN;
};
export type CollectProtocolEventInput = {
    pool_id: [AssetIdInput, AssetIdInput, BigNumberish];
    owner: IdentityInput;
    recipient: IdentityInput;
    amount_0: BigNumberish;
    amount_1: BigNumberish;
};
export type CollectProtocolEventOutput = {
    pool_id: [AssetIdOutput, AssetIdOutput, BN];
    owner: IdentityOutput;
    recipient: IdentityOutput;
    amount_0: BN;
    amount_1: BN;
};
export type ContractIdInput = {
    bits: string;
};
export type ContractIdOutput = ContractIdInput;
export type CreatePoolEventInput = {
    pool_id: [AssetIdInput, AssetIdInput, BigNumberish];
    sqrt_price_x96: BigNumberish;
};
export type CreatePoolEventOutput = {
    pool_id: [AssetIdOutput, AssetIdOutput, BN];
    sqrt_price_x96: BN;
};
export type EnableFeeAmountEventInput = {
    fee: BigNumberish;
    tick_spacing: BigNumberish;
};
export type EnableFeeAmountEventOutput = {
    fee: BN;
    tick_spacing: BN;
};
export type I256Input = {
    underlying: BigNumberish;
};
export type I256Output = {
    underlying: BN;
};
export type I64Input = {
    underlying: BigNumberish;
};
export type I64Output = {
    underlying: BN;
};
export type MintEventInput = {
    nft_id: AssetIdInput;
    pool_id: [AssetIdInput, AssetIdInput, BigNumberish];
    recipient: IdentityInput;
    liquidity: BigNumberish;
    tick_lower: I64Input;
    tick_upper: I64Input;
    amount_0_actual: BigNumberish;
    amount_1_actual: BigNumberish;
};
export type MintEventOutput = {
    nft_id: AssetIdOutput;
    pool_id: [AssetIdOutput, AssetIdOutput, BN];
    recipient: IdentityOutput;
    liquidity: BN;
    tick_lower: I64Output;
    tick_upper: I64Output;
    amount_0_actual: BN;
    amount_1_actual: BN;
};
export type OwnershipSetInput = {
    new_owner: IdentityInput;
};
export type OwnershipSetOutput = {
    new_owner: IdentityOutput;
};
export type OwnershipTransferredInput = {
    new_owner: IdentityInput;
    previous_owner: IdentityInput;
};
export type OwnershipTransferredOutput = {
    new_owner: IdentityOutput;
    previous_owner: IdentityOutput;
};
export type PoolInfoInput = {
    id: [AssetIdInput, AssetIdInput, BigNumberish];
    tick_spacing: BigNumberish;
    max_liq_per_tick: BigNumberish;
};
export type PoolInfoOutput = {
    id: [AssetIdOutput, AssetIdOutput, BN];
    tick_spacing: BN;
    max_liq_per_tick: BN;
};
export type PoolStateInput = {
    sqrtPriceX96: BigNumberish;
    tick: I64Input;
    fee_protocol: BigNumberish;
    unlocked: boolean;
    feeGrowthGlobal0X128: BigNumberish;
    feeGrowthGlobal1X128: BigNumberish;
    protocolFees: ProtocolFeesInput;
    liquidity: BigNumberish;
    reserve_0: BigNumberish;
    reserve_1: BigNumberish;
};
export type PoolStateOutput = {
    sqrtPriceX96: BN;
    tick: I64Output;
    fee_protocol: BN;
    unlocked: boolean;
    feeGrowthGlobal0X128: BN;
    feeGrowthGlobal1X128: BN;
    protocolFees: ProtocolFeesOutput;
    liquidity: BN;
    reserve_0: BN;
    reserve_1: BN;
};
export type PositionInfoInput = {
    liquidity: BigNumberish;
    feeGrowthInside0LastX128: BigNumberish;
    feeGrowthInside1LastX128: BigNumberish;
    tokensOwed0: BigNumberish;
    tokensOwed1: BigNumberish;
};
export type PositionInfoOutput = {
    liquidity: BN;
    feeGrowthInside0LastX128: BN;
    feeGrowthInside1LastX128: BN;
    tokensOwed0: BN;
    tokensOwed1: BN;
};
export type ProtocolFeesInput = {
    token0: BigNumberish;
    token1: BigNumberish;
};
export type ProtocolFeesOutput = {
    token0: BN;
    token1: BN;
};
export type SetDecimalsEventInput = {
    asset: AssetIdInput;
    decimals: BigNumberish;
    sender: IdentityInput;
};
export type SetDecimalsEventOutput = {
    asset: AssetIdOutput;
    decimals: number;
    sender: IdentityOutput;
};
export type SetFeeProtocolEventInput = {
    fee_protocol_0_old: BigNumberish;
    fee_protocol_1_old: BigNumberish;
    fee_protocol_0_new: BigNumberish;
    fee_protocol_1_new: BigNumberish;
};
export type SetFeeProtocolEventOutput = {
    fee_protocol_0_old: BN;
    fee_protocol_1_old: BN;
    fee_protocol_0_new: BN;
    fee_protocol_1_new: BN;
};
export type SetNameEventInput = {
    asset: AssetIdInput;
    name: Option<StdString>;
    sender: IdentityInput;
};
export type SetNameEventOutput = {
    asset: AssetIdOutput;
    name: Option<StdString>;
    sender: IdentityOutput;
};
export type SetSymbolEventInput = {
    asset: AssetIdInput;
    symbol: Option<StdString>;
    sender: IdentityInput;
};
export type SetSymbolEventOutput = {
    asset: AssetIdOutput;
    symbol: Option<StdString>;
    sender: IdentityOutput;
};
export type SwapEventInput = {
    pool_id: [AssetIdInput, AssetIdInput, BigNumberish];
    recipient: IdentityInput;
    asset_0_in: BigNumberish;
    asset_1_in: BigNumberish;
    asset_0_out: BigNumberish;
    asset_1_out: BigNumberish;
    sqrt_price_x96: BigNumberish;
    liquidity: BigNumberish;
    tick: I64Input;
};
export type SwapEventOutput = {
    pool_id: [AssetIdOutput, AssetIdOutput, BN];
    recipient: IdentityOutput;
    asset_0_in: BN;
    asset_1_in: BN;
    asset_0_out: BN;
    asset_1_out: BN;
    sqrt_price_x96: BN;
    liquidity: BN;
    tick: I64Output;
};
export type TickInfoInput = {
    liquidity_gross: BigNumberish;
    liquidity_net: I256Input;
    fee_growth_outside_0_X128: BigNumberish;
    fee_growth_outside_1_X128: BigNumberish;
    initialized: boolean;
};
export type TickInfoOutput = {
    liquidity_gross: BN;
    liquidity_net: I256Output;
    fee_growth_outside_0_X128: BN;
    fee_growth_outside_1_X128: BN;
    initialized: boolean;
};
export declare class ReactorPoolContractInterface extends Interface {
    constructor();
    functions: {
        owner: FunctionFragment;
        is_paused: FunctionFragment;
        pause: FunctionFragment;
        unpause: FunctionFragment;
        decimals: FunctionFragment;
        name: FunctionFragment;
        symbol: FunctionFragment;
        total_assets: FunctionFragment;
        total_supply: FunctionFragment;
        burn: FunctionFragment;
        collect: FunctionFragment;
        collect_protocol: FunctionFragment;
        create_pool: FunctionFragment;
        enable_fee_amount: FunctionFragment;
        initialize_fee_amount_tick_spacing: FunctionFragment;
        is_fee_amount_enabled: FunctionFragment;
        is_tick_initialized: FunctionFragment;
        mint: FunctionFragment;
        pool_info: FunctionFragment;
        pool_state: FunctionFragment;
        position_info: FunctionFragment;
        set_fee_protocol: FunctionFragment;
        swap: FunctionFragment;
        tick_info: FunctionFragment;
        transfer_ownership: FunctionFragment;
    };
}
export declare class ReactorPoolContract extends __Contract {
    static readonly abi: {
        programType: string;
        specVersion: string;
        encodingVersion: string;
        concreteTypes: ({
            type: string;
            concreteTypeId: string;
            metadataTypeId?: undefined;
            typeArguments?: undefined;
        } | {
            type: string;
            concreteTypeId: string;
            metadataTypeId: number;
            typeArguments?: undefined;
        } | {
            type: string;
            concreteTypeId: string;
            metadataTypeId: number;
            typeArguments: string[];
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
            typeParameters?: undefined;
        } | {
            type: string;
            metadataTypeId: number;
            components?: undefined;
            typeParameters?: undefined;
        } | {
            type: string;
            metadataTypeId: number;
            components: ({
                name: string;
                typeId: string;
            } | {
                name: string;
                typeId: number;
            })[];
            typeParameters: number[];
        } | {
            type: string;
            metadataTypeId: number;
            components: ({
                name: string;
                typeId: number;
                typeArguments?: undefined;
            } | {
                name: string;
                typeId: number;
                typeArguments: {
                    name: string;
                    typeId: number;
                }[];
            })[];
            typeParameters?: undefined;
        })[];
        functions: {
            inputs: {
                name: string;
                concreteTypeId: string;
            }[];
            name: string;
            output: string;
            attributes: {
                name: string;
                arguments: string[];
            }[];
        }[];
        loggedTypes: {
            logId: string;
            concreteTypeId: string;
        }[];
        messagesTypes: never[];
        configurables: never[];
    };
    static readonly storageSlots: StorageSlot[];
    interface: ReactorPoolContractInterface;
    functions: {
        owner: InvokeFunction<[], StateOutput>;
        is_paused: InvokeFunction<[], boolean>;
        pause: InvokeFunction<[], void>;
        unpause: InvokeFunction<[], void>;
        decimals: InvokeFunction<[asset: AssetIdInput], Option<number>>;
        name: InvokeFunction<[asset_id: AssetIdInput], Option<StdString>>;
        symbol: InvokeFunction<[asset_id: AssetIdInput], Option<StdString>>;
        total_assets: InvokeFunction<[], BN>;
        total_supply: InvokeFunction<[asset: AssetIdInput], Option<BN>>;
        burn: InvokeFunction<[pool_id: [AssetIdInput, AssetIdInput, BigNumberish], tick_lower: I64Input, tick_upper: I64Input, liquidity: BigNumberish], [BN, BN]>;
        collect: InvokeFunction<[pool_id: [AssetIdInput, AssetIdInput, BigNumberish], recipient: IdentityInput, tick_lower: I64Input, tick_upper: I64Input, amount_0_requested: BigNumberish, amount_1_requested: BigNumberish], [BN, BN]>;
        collect_protocol: InvokeFunction<[pool_id: [AssetIdInput, AssetIdInput, BigNumberish], recipient: IdentityInput, amount_0_requested: BigNumberish, amount_1_requested: BigNumberish], [BN, BN]>;
        create_pool: InvokeFunction<[token_0_id: AssetIdInput, token_1_id: AssetIdInput, fee: BigNumberish, sqrt_price_x96: BigNumberish], [AssetIdOutput, AssetIdOutput, BN]>;
        enable_fee_amount: InvokeFunction<[fee: BigNumberish, tick_spacing: BigNumberish], void>;
        initialize_fee_amount_tick_spacing: InvokeFunction<[], void>;
        is_fee_amount_enabled: InvokeFunction<[fee_amount: BigNumberish], BN>;
        is_tick_initialized: InvokeFunction<[pool_id: [AssetIdInput, AssetIdInput, BigNumberish], tick: I64Input], boolean>;
        mint: InvokeFunction<[pool_id: [AssetIdInput, AssetIdInput, BigNumberish], to: IdentityInput, tick_lower: I64Input, tick_upper: I64Input, liquidity: BigNumberish], [AssetIdOutput, BN, BN]>;
        pool_info: InvokeFunction<[pool_id: [AssetIdInput, AssetIdInput, BigNumberish]], Option<PoolInfoOutput>>;
        pool_state: InvokeFunction<[pool_id: [AssetIdInput, AssetIdInput, BigNumberish]], Option<PoolStateOutput>>;
        position_info: InvokeFunction<[pool_id: [AssetIdInput, AssetIdInput, BigNumberish], owner: IdentityInput, tick_lower: I64Input, tick_upper: I64Input], Option<PositionInfoOutput>>;
        set_fee_protocol: InvokeFunction<[pool_id: [AssetIdInput, AssetIdInput, BigNumberish], fee_protocol_0: BigNumberish, fee_protocol_1: BigNumberish], void>;
        swap: InvokeFunction<[pool_id: [AssetIdInput, AssetIdInput, BigNumberish], recipient: IdentityInput, zeroForOne: boolean, amountSpecified: I256Input, sqrtPriceLimitX96: BigNumberish], [I256Output, I256Output]>;
        tick_info: InvokeFunction<[pool_id: [AssetIdInput, AssetIdInput, BigNumberish], tick: I64Input], TickInfoOutput>;
        transfer_ownership: InvokeFunction<[new_owner: IdentityInput], void>;
    };
    constructor(id: string | Address, accountOrProvider: Account | Provider);
}
//# sourceMappingURL=ReactorPoolContract.d.ts.map