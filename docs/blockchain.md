<div align="center">
  <p align="center">
    <img src="./img/solidguard-v1.png" width="200" alt="SolidGuard Logo" />
  </p>
<h1>Setup for solidguard-blockchain</h1>
</div>

**Version:** `v1.0.2`

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
  - [1. Environment Variables Setup](#1-environment-variables-setup)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Deploy smart contract](#3-deploy-smart-contract)
  - [4. Verify on Etherscan](#4-verify-on-etherscan)

## Environment Variables
* **Etherscan** - Third Party API used for getting blockchain information.
  * `ETHERSCAN_API_KEY` Etherscan API key. You will need to create an account to generate one. See [this](https://info.etherscan.com/api-keys/) for more information.
* **Ethereum** - Blockchain used for SolidGuard. Note that the network referred must be consistent between Etherscan and all blockchain-related environment variables.
  * `DEPLOY_PRIVATE_KEY` Private key used to deploy the SolidGuardManager contract. Make sure it has enough Ether to deploy!
  * `PROVIDER_URL` Blockchain provider URL to get information from the blockchain via the `ethers` library. You can use [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) here, just make sure the network it is providing is the same as the Etherscan API URL (i.e. must use a rinkeby provider url if using rinkeby.etherscan).

## Local Setup

### 1. Environment Variables Setup
Fill in the following environment variables in a new file called `.env`. Examples of these variables can be seen in [`.env.example`](../.env.example), and information can be seen [here](#environment-variables).

### 2. Install dependencies

```bash
npm install
```

### 3. Deploy smart contract

Run the script via hardhat that will deploy the SolidGuardManager.

```bash
npx hardhat run ./deploy/main/solid-guard-manager.deploy.ts --network providerNetwork
```

### 4. Verify on Etherscan

Using the SolidGuardManager's implementation address, use it to verify the smart contract on Etherscan.

```bash
npx hardhat verify --network providerNetwork <SGM_IMPL_ADDR>
```

[Back to top](#table-of-contents)
