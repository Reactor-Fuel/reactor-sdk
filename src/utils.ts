import JSBI from "jsbi";

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


const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));

export function encodeSqrtRatioX96(
    amount1: JSBI,
    amount0: JSBI
): JSBI {
    if (JSBI.equal(amount0, JSBI.BigInt(0))) {
        throw new Error("amount0 is zero");
    }

    const ratioX192 = JSBI.leftShift(
        JSBI.divide(
            JSBI.multiply(amount1, Q96),
            amount0
        ),
        JSBI.BigInt(96)
    );

    return sqrt(ratioX192);
}

function sqrt(value: JSBI): JSBI {
    if (JSBI.lessThan(value, JSBI.BigInt(0))) {
        throw new Error("NEGATIVE");
    }
    if (JSBI.lessThan(value, JSBI.BigInt(2))) {
        return value;
    }

    let z = value;
    let x = JSBI.add(JSBI.divide(value, JSBI.BigInt(2)), JSBI.BigInt(1));

    while (JSBI.lessThan(x, z)) {
        z = x;
        x = JSBI.divide(
            JSBI.add(JSBI.divide(value, x), x),
            JSBI.BigInt(2)
        );
    }
    return z;
}


