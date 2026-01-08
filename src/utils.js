"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxTick = exports.getMinTick = exports.MAX_TICK = exports.MIN_TICK = exports.TICK_SPACINGS = exports.FeeAmount = void 0;
exports.getUsableTick = getUsableTick;
var FeeAmount;
(function (FeeAmount) {
    FeeAmount[FeeAmount["LOWEST"] = 100] = "LOWEST";
    FeeAmount[FeeAmount["LOW"] = 500] = "LOW";
    FeeAmount[FeeAmount["MEDIUM"] = 3000] = "MEDIUM";
    FeeAmount[FeeAmount["HIGH"] = 10000] = "HIGH";
})(FeeAmount || (exports.FeeAmount = FeeAmount = {}));
exports.TICK_SPACINGS = {
    [FeeAmount.LOWEST]: 1,
    [FeeAmount.LOW]: 10,
    [FeeAmount.MEDIUM]: 60,
    [FeeAmount.HIGH]: 200,
};
exports.MIN_TICK = -887272;
exports.MAX_TICK = 887272;
function getUsableTick(tick, tickSpacing) {
    const rounded = Math.round(tick / tickSpacing) * tickSpacing;
    if (rounded < exports.MIN_TICK)
        return rounded + tickSpacing;
    else if (rounded > exports.MAX_TICK)
        return rounded - tickSpacing;
    else
        return rounded;
}
const getMinTick = (tickSpacing) => getUsableTick(exports.MIN_TICK, tickSpacing);
exports.getMinTick = getMinTick;
const getMaxTick = (tickSpacing) => getUsableTick(exports.MAX_TICK, tickSpacing);
exports.getMaxTick = getMaxTick;
//# sourceMappingURL=utils.js.map