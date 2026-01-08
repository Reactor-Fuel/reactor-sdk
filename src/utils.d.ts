export declare enum FeeAmount {
    LOWEST = 100,
    LOW = 500,
    MEDIUM = 3000,
    HIGH = 10000
}
export declare const TICK_SPACINGS: {
    [amount in FeeAmount]: number;
};
export declare const MIN_TICK = -887272;
export declare const MAX_TICK = 887272;
export declare function getUsableTick(tick: number, tickSpacing: number): number;
export declare const getMinTick: (tickSpacing: number) => number;
export declare const getMaxTick: (tickSpacing: number) => number;
//# sourceMappingURL=utils.d.ts.map