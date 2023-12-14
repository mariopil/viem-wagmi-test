# Viem - Wagmi test example

This repository contains an example that uses Viem with EIP712 changes and Wagmi-beta to interact with ZkSync chain.

## Getting started

### Prerequisites

1. Ensure you have `bun` and `pnpm` installed.

1. Download `eip712_signer` branch from https://github.com/eigerco/viem.

1. Modify `package.json` files:

 * in the main viem directory add following beneath `"type": "module"`:

 ``` json
   "name": "viem_zksync",
   "version": "0.0.1",
   "main": "src/index.ts",
 ```

* in `src/actions` replace the content with:

``` json
{
  "name": "viem_zksync_actions",
  "type": "module"
}
```

* in `src/chains` replace the content with:

``` json
{
  "name": "viem_zksync_chains",
  "type": "module"
}
```

1. Run `bun install`

1. Run `bun link` in the main directory. Then run the same command in `src/actions` and `src/chains`

1. Download `beta` branch from https://github.com/wevm/wagmi

1. Run `pnpm install` and then `pnpm build`

1. Run `bun link` in the following directories inside `wagmi`:

* `packages/react`

* `packages/core`

* `packages/connectors`

1. Go to this projects directory and run

* `bun install`

* `./bunlink.sh`

1. Finally run `bun dev` - this will start the app, and open `http://localhost:5173/` in the browser

### Project uses testnet ZkSync chain. You will need to have a ZkSync testnet account and MetaMask installed to perform tests. 