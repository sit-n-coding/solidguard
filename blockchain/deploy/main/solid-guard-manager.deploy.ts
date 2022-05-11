import { ContractFactory } from '@ethersproject/contracts';
import { Contract } from 'ethers';
import { ethers, upgrades } from 'hardhat';

async function deploySolidGuardManager(): Promise<void> {
  const SolidGuardManager: ContractFactory = await ethers.getContractFactory(
    'SolidGuardManager',
  );
  const solidGuardManager: Contract = await upgrades.deployProxy(SolidGuardManager, [], 
                                                                 { initializer: 'initialize' });
  await solidGuardManager.deployed();
  console.log('SolidGuardManager\'s proxy address:', solidGuardManager.address);
  const implAddr = await upgrades.erc1967.getImplementationAddress(solidGuardManager.address);
  console.log('SolidGuardManager\'s implementation address:', implAddr);
  console.log(`Verify the smart contract on etherscan by doing the following:`,
              `npx hardhat verify --network providerNetwork ${implAddr}`)
}

deploySolidGuardManager()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
