import { ContractFactory } from '@ethersproject/contracts';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

async function deployTestTimelockController(): Promise<void> {
  const TestTimelockController: ContractFactory = await ethers.getContractFactory(
    'TestTimelockController',
  );
  const ttc: Contract = await TestTimelockController.deploy(60000, [], []);
  console.log('TestTimelockController address:', ttc.address);
  console.log(
    'Verify with the following:',
    'npx hardhat verify --constructor-args ./deploy/test/arguments/test-timelock-controller.arguments.ts --network providerNetwork',
    ttc.address,
  );
}

deployTestTimelockController()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
