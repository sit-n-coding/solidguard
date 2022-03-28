import { ContractFactory } from '@ethersproject/contracts';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

async function deploySolidGuardManager(): Promise<void> {
  const SolidGuardManager: ContractFactory = await ethers.getContractFactory(
    'SolidGuardManager',
  );
  const solidGuardManager: Contract = await SolidGuardManager.deploy();
  console.log('SolidGuardManager address:', solidGuardManager.address);
  console.log(
    'Verify with the following:',
    'npx hardhat verify --network providerNetwork',
    solidGuardManager.address,
  );
}

deploySolidGuardManager()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
