<div align="center">
  <p align="center">
    <img src="../api/docs/img/solidguard-prototype-v1-2.png" width="200" alt="SolidGuard Logo" />
  </p>
<h1>Smart Contract Setup for solidguard-blockchain</h1>
</div>

# Smart Contract Setup
First, you will need to run
```bash
npx hardhat run --network providerNetwork deploy/main/solid-guard-manager.deploy.ts
```
to deploy a new SolidGuardManager under the ownership of the deployer account.

You will see an address appear in the console. Copy it and save it in the `.env` file as `SGM_ADDRESS`.

Next, you will need to verify the smart contract on etherscan by doing
```bash
npx hardhat verify --network providerNetwork SGM_ADDRESS
```
with `SGM_ADDRESS` being the addressed printed from earlier.

# dApp Setup

This will provide instructions on how to setup your dApp to be pauseable by SolidGuard.

1. Create a copy of [`SolidGuardPauseable.sol`](contracts/src/SolidGuardPauseable.sol) into your smart contract repository.

2. Replace the zero address (`0x0000000000000000000000000000000000000000`) with the address of the SolidGuardManager that has already been deployed on the blockchain.

3. Have your smart contract inherit SolidGuardPauseable. Your smart contract will now have access to a function called `isSGPaused()` which returns a boolean determining if the smart contract has been paused or not.

4. Apply the function `isSGPaused()` in require statements, and use them in any sensitive functions that should be paused in an event of a possible vulnerability.

5. Deploy the smart contract onto the blockchain.

6. Verify the smart contract on Etherscan.

**Note:** It should be noted that adding SolidGuardPauseable will make your smart contracts centralized to the SolidGuardManager. To keep its ability to be decentralized, while also keeping the Pauseability feature, we recommend implementing a function that would revoke the SolidGuardManager's ability to pause critical functions in the smart contract after a given amount of time.

Running test smart contract:
```bash
npx hardhat run deploy/test/test-timelock-controller.deploy.ts --network providerNetwork
```
