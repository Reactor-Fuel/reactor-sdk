"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoolState = getPoolState;
const ReactorPoolContract_1 = require("./contracts/ReactorPoolContract");
async function getPoolState(reactorPoolContractId, creatorWallet, poolId) {
    const reactorPool = new ReactorPoolContract_1.ReactorPoolContract(reactorPoolContractId, creatorWallet);
    const { value: poolState } = await reactorPool.functions.pool_state(poolId).dryRun();
    return poolState;
}
//# sourceMappingURL=getPoolState.js.map