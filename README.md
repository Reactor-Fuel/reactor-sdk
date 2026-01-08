# Reactor CL DEX TypeScript SDK

Create pool, add/remove liquidity, quote/swap, collect fees.

### Mainnet deployment
Currently deployed on Ignition: https://app.fuel.network/contract/0xe0eeb0f14dbc2793a1fb701c507f184f6d44f1cee08f83fe3837b8ef41f55818

reactorPoolContractId = '0xe0eeb0f14dbc2793a1fb701c507f184f6d44f1cee08f83fe3837b8ef41f55818'

Top liquidity pools can be found at https://reactor.exchange/

Assets ids could be found at https://docs.fuel.network/docs/verified-addresses/assets/#fuel-mainnet

#### Fees on Mainnet
`FeeAmount.LOWEST`: 0.01% = LP fee 0.005% + protocol fee 0.005%

`FeeAmount.LOW`: 0.15% = LP fee 0.05% + protocol fee 0.05%

`FeeAmount.MEDIUM`: 0.35% = LP fee 0.3% + protocol fee 0.05%

`FeeAmount.HIGH`: 1.05% = LP fee 1% + protocol fee 0.05%

### Testnet deployment
Currently deployed on Fuel Sepolia Testnet: https://app-testnet.fuel.network/contract/0xa5843e9c21e5039d527b25b45c8f3c28ca33258ae52e6350764024ef24831966

reactorPoolContractId = '0xa5843e9c21e5039d527b25b45c8f3c28ca33258ae52e6350764024ef24831966'
mock tokens on testnet (faucet at https://testnet.reactor.exchange/):
FUEL: `0x20e155534c6351321855c44ef045a11cee96616c507278ed407b0946dbd68995`
USDT: `0x0cfca15662bf7cd948c681a32d6c639b01a79c1ad2428a65cc09a9417bb29b88`
USDC: `0x0e992cf93b0608b91810c8019b1efec87581e27c26f85a356ffe7b307c5a8611`
BTC:  `0x410722449f15d387bbce10a0989bf349aee17090e97785d23da524997c0bc6c0`
ETH:  `0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07`

### Sample pool setup
```typescript
const reactorPoolContractId = '0xa5843e9c21e5039d527b25b45c8f3c28ca33258ae52e6350764024ef24831966'
const usdcAssetId = '0x0e992cf93b0608b91810c8019b1efec87581e27c26f85a356ffe7b307c5a8611'
const btcAssetId = '0x410722449f15d387bbce10a0989bf349aee17090e97785d23da524997c0bc6c0'
const fee = FeeAmount.MEDIUM
```

### Quote exact in
Returns "amountOut" for specified "amountIn"
```typescript
let amountOut = await quoteExactIn(
    reactorPoolContractId,
    wallet,
    [usdcAssetId, // pool's token0 asset id
        btcAssetId, // pool's token1 asset id
        fee // pool's fee tier
    ],
    btcAssetId, // input token
    usdcAssetId, // output token
    '100000', // input amount
);
```
### Swap exact in
```typescript
let txResult = await swapExactIn(
    reactorPoolContractId,
    wallet,
    [usdcAssetId, // pool's token0 asset id
        btcAssetId, // pool's token1 asset id
        fee // pool's fee tier
    ],
    btcAssetId, // input token
    usdcAssetId, // output token
    '100000', // input amount
);
```

### Quote exact out
Returns "amountIn" for specified "amountOut"
```typescript
let amountIn = quoteExactOut(
    reactorPoolContractId,
    wallet,
    [usdcAssetId, // pool's token0 asset id
        btcAssetId, // pool's token1 asset id
        fee // pool's fee tier
    ],
    btcAssetId, // input token
    usdcAssetId, // output token
    '100000', // output amount
)
```
### Swap exact out
```typescript
let txResult = await swapExactOut(
    reactorPoolContractId,
    wallet,
    [usdcAssetId, // pool's token0 asset id
        btcAssetId, // pool's token1 asset id
        fee // pool's fee tier
    ],
    btcAssetId, // input token
    usdcAssetId, // output token
    '100000', // output amount
)
```