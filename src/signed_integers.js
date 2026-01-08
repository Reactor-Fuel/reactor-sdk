"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberToI64Input = numberToI64Input;
// import bn from 'bignumber.js'
// import { BigNumber, BigNumberish, constants, Contract, ContractTransaction, Wallet } from 'ethers';
const fuels_1 = require("fuels");
/**
 * export type I256Input = { underlying: BigNumberish };
 * export type I256Output = { underlying: BN };
 * export type I64Input = { underlying: BigNumberish };
 * export type I64Output = { underlying: BN };
 * **/
const I64_INDENT_BN = new fuels_1.BN('9223372036854775808');
// const I256_INDENT_BN = new BN('0x8000000000000000000000000000000000000000000000000000000000000000');
/* export function i64OutputToBigNumber(output: I64Output): BigNumber {
    const underlying = BigNumber.from(output.underlying.toString())
    if (underlying.eq(I64_INDENT_BN)) {
        return BigNumber.from(0)
    } else if (underlying.gt(I64_INDENT_BN)) {
        return underlying.sub(I64_INDENT_BN)
    } else {
        return I64_INDENT_BN.sub(underlying).mul(-1)
    }
}
 */
function numberToI64Input(n) {
    if (n == 0) {
        return { underlying: I64_INDENT_BN.toString() };
    }
    else if (n > 0) {
        return { underlying: I64_INDENT_BN.add(n).toString() };
    }
    else {
        return { underlying: I64_INDENT_BN.sub(-n).toString() };
    }
}
/* export function bigNumberishToI256Input(n: BigNumberish): I256Input {
    const bn = BigNumber.from(n.toString())
    console.log(`input bn = ${bn.toString()}`)
    const zero = BigNumber.from('0')
    if (bn.eq(zero)) {
        return { underlying: I256_INDENT_BN.toString() }
    } else if (bn.gt(zero)) {
        return { underlying: I256_INDENT_BN.add(bn).toString() }
    } else {
        return { underlying: I256_INDENT_BN.sub(-bn).toString()}
    }
}

export function i256OutputToBigNumber(output: I256Output): BigNumber {
    const underlying = BigNumber.from(output.underlying.toString())
    console.log(`debug underl: ${underlying}`)
    if (underlying.eq(I256_INDENT_BN)) {
        return BigNumber.from(0)
    } else if (underlying.gt(I256_INDENT_BN)) {
        return underlying.sub(I256_INDENT_BN)
    } else {
        return I256_INDENT_BN.sub(underlying).mul(-1)
    }
}
 */ 
//# sourceMappingURL=signed_integers.js.map