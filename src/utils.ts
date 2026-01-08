export enum FeeAmount {
    LOWEST = 100,
    LOW = 1500,
    MEDIUM = 3500,
    HIGH = 10500,
}

export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
    [FeeAmount.LOWEST]: 10,
    [FeeAmount.LOW]: 10,
    [FeeAmount.MEDIUM]: 60,
    [FeeAmount.HIGH]: 200,
};

export const MIN_TICK = -887272;
export const MAX_TICK = 887272;

export function getUsableTick(tick: number, tickSpacing: number) {
    const rounded = Math.round(tick / tickSpacing) * tickSpacing;
    if (rounded < MIN_TICK) return rounded + tickSpacing;
    else if (rounded > MAX_TICK) return rounded - tickSpacing;
    else return rounded;
}

export const getMinTick = (tickSpacing: number) => getUsableTick(MIN_TICK, tickSpacing);

export const getMaxTick = (tickSpacing: number) => getUsableTick(MAX_TICK, tickSpacing);