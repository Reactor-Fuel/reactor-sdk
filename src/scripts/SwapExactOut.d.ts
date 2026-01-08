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
export type SwapExactOutInputs = [pool_id: [AssetIdInput, AssetIdInput, BigNumberish], token_in: AssetIdInput, token_out: AssetIdInput, recipient: IdentityInput, amount_out: BigNumberish, amount_in_maximum: BigNumberish, sqrt_price_limit_x96: BigNumberish, deadline: BigNumberish];
export type SwapExactOutOutput = BN;
export type SwapExactOutConfigurables = Partial<{
    REACTOR_POOL_CONTRACT_ID: ContractIdInput;
}>;
export declare class SwapExactOut extends __Script<SwapExactOutInputs, SwapExactOutOutput> {
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
//# sourceMappingURL=SwapExactOut.d.ts.map