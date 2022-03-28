import { ConfigService } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { promiseTimer } from '../utils';
import { ContractService } from '../../src/contract/contract.service';
import { clearDB, getModuleRef } from '../utils';
import { GithubContractInfoDto } from 'src/contract/dto';

/*
 * NOTE:
 * - These testcases will only work with the DEPLOY_PRIVATE_KEY of 0xa2eDe474EcFaaF9CF2Da9b1Da65617D5966c3Ccb,
 *   any ETHERSCAN_API_KEY, ETHERSCAN_URL=https://api-rinkeby.etherscan.io/ and
 *   SGM_ADDRESS=0x05BA813eA8d76b1553f68A1b5dC942e71846adD9.
 * - pauseContracts is not tested, since its functionality is tested in the solid-guard-manager-spec.ts script.
 */

describe('ContractService', () => {
  let contractService: ContractService;
  let moduleRef: TestingModule;
  let configService: ConfigService;
  const delay = 500; // Used to prevent rate limiting, since these testcases uses live APIs.
  const ttcAddr = '0x8eAFc979530127E42ECf8908962B646D3BEc692D';
  const sgmAddr = '0x05BA813eA8d76b1553f68A1b5dC942e71846adD9';
  const deployerAddr = '0xa2eDe474EcFaaF9CF2Da9b1Da65617D5966c3Ccb';
  const tcInfo: GithubContractInfoDto = {
    author: 'OpenZeppelin',
    repo: 'openzeppelin-contracts',
    path: 'contracts/governance/TimelockController.sol',
    ref: '24a0bc23cfe3fbc76f8f2510b78af1e948ae6651',
  };

  beforeEach(async () => {
    moduleRef = await getModuleRef();
    contractService = moduleRef.get<ContractService>(ContractService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('verifyPauseableContract', () => {
    beforeEach(async () => {
      await promiseTimer(delay);
    });
    it(`Apply check on TestTimelockController (${ttcAddr})`, async () => {
      expect(await contractService.verifyPauseableContract(ttcAddr)).to.be.true;
    });
    it(`Apply check on SolidGuardManager (${sgmAddr})`, async () => {
      expect(await contractService.verifyPauseableContract(sgmAddr)).to.be
        .false;
    });
    it(`Apply check on deployer (${deployerAddr})`, async () => {
      expect(await contractService.verifyPauseableContract(deployerAddr)).to.be
        .false;
    });
  });

  describe('verifyDevOfContract', () => {
    beforeEach(async () => {
      await promiseTimer(delay);
    });
    it(`Signed by the deployer of SGM (${sgmAddr})`, async () => {
      const deployerWallet = new ethers.Wallet(
        configService.get<string>('DEPLOY_PRIVATE_KEY')
      );
      const message = 'Welcome to Ethereum L2s!';
      const signedMessage = await deployerWallet.signMessage(message);
      expect(
        await contractService.verifyDevOfContract(
          sgmAddr,
          message,
          signedMessage
        )
      ).to.be.true;
    });
    it(`Signed by a wallet that didn't deploy TTC (${ttcAddr})`, async () => {
      const randomWallet = ethers.Wallet.createRandom();
      const message = 'Welcome to Gethereum L3s!';
      const signedMessage = await randomWallet.signMessage(message);
      expect(
        await contractService.verifyDevOfContract(
          ttcAddr,
          message,
          signedMessage
        )
      ).to.be.false;
    });
  });

  describe('createContractDB + getContractDB', () => {
    beforeEach(async () => {
      await promiseTimer(delay);
    });
    it(`Add TestTimelockController (${ttcAddr})`, async () => {
      await contractService.createContractDB(ttcAddr);
      const c = await contractService.getContractDB(ttcAddr);
      expect(c.pause).to.be.true;
      expect(c.addr).to.be.equal(ttcAddr);
    });
    it(`Add SolidGuardManager (${sgmAddr})`, async () => {
      await contractService.createContractDB(sgmAddr);
      const c = await contractService.getContractDB(sgmAddr);
      expect(c.pause).to.be.false;
      expect(c.addr).to.be.equal(sgmAddr);
    });
  });

  describe('isValidGithubContract', () => {
    beforeEach(async () => {
      await promiseTimer(delay);
    });
    it(`Is valid GithubContract`, async () => {
      expect(
        await contractService.isValidGithubContract({
          author: 'SolidGuard',
          repo: 'solidguard-prototype-backend',
          path: 'contracts/src/SolidGuardPauseable.sol',
          ref: 'cca722dd3838bd697ae10865286b7551f5a6698a',
        })
      ).to.be.true;
    });
    it(`Invalid Input`, async () => {
      expect(
        await contractService.isValidGithubContract({
          author: 'author',
          repo: 'repo',
          path: 'er.sol',
          ref: 'cool',
        })
      ).to.be.false;
    });
    it(`Not a Solidity Smart Contract`, async () => {
      expect(
        await contractService.isValidGithubContract({
          author: 'SolidGuard',
          repo: 'solidguard-prototype-backend',
          path: '.env.example',
          ref: 'cca722dd3838bd697ae10865286b7551f5a6698a',
        })
      ).to.be.false;
    });
  });

  describe('getAllContractAddrs', () => {
    beforeEach(async () => {
      await promiseTimer(delay);
    });
    it(`Get 0 contract addresses`, async () => {
      const addrs = await contractService.getAllContractAddrs();
      expect(addrs.length).to.equal(0);
    });
    it(`Get 1 contract address`, async () => {
      await contractService.createContractDB(ttcAddr);
      const addrs = await contractService.getAllContractAddrs();
      expect(addrs[0]).to.equal(ttcAddr);
      expect(addrs.length).to.equal(1);
    });
    it(`Get multiple contract addresses`, async () => {
      await contractService.createContractDB(sgmAddr);
      await contractService.createContractDB(ttcAddr);
      const addrs = await contractService.getAllContractAddrs();
      expect(addrs[0]).to.equal(sgmAddr);
      expect(addrs[1]).to.equal(ttcAddr);
      expect(addrs.length).to.equal(2);
    });
  });

  describe('hasGithubContractFromAddrs', () => {
    beforeEach(async () => {
      await promiseTimer(delay);
    });
    it(`TestTimelockController + SolidGuardManager testcase (${ttcAddr}, ${sgmAddr})`, async () => {
      const affectedAddrs = await contractService.hasGithubContractFromAddrs(
        tcInfo,
        [ttcAddr, sgmAddr]
      );
      expect(affectedAddrs).to.contain(ttcAddr);
      expect(affectedAddrs.length).to.equal(1);
    });
  });

  afterEach(async () => {
    await clearDB();
  });
});
