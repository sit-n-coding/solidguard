import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { ContractService } from '../src/contract/contract.service';
import { clearDB, getModuleRef } from './utils';
import { AppModule } from '../src/app.module';
import { EtherscanDAO } from '../src/contract/etherscan.dao';
import { EtherscanContractsDto } from '../src/contract/dto';

// Smart contracts:
import { solidGuardPauseable } from '../src/source/solid-guard-pauseable';
import { testTimelockController } from './source/test-timelock-controller';
import { timelockController } from './source/timelock-controller';
import { solidGuardManager } from './source/solid-guard-manager';

/*
 * NOTE:
 * - pauseContracts is not tested, since its functionality is tested in the solid-guard-manager-spec.ts script.
 */

describe('ContractService', () => {
  let contractService: ContractService;
  let moduleRef: TestingModule;
  let configService: ConfigService;
  let sgmAddr: string;
  const tt1 = '0x4Ec2f061b44fCCA27F2C780aFCDa6EF0FD3dDa2c';
  const tt2 = '0xB871bBeC846c35fcA8bda76df8e529230888Dd02';

  const getModuleRefAndOverrideEtherscanDAO = (
    fcns: {
      getSourceCode?: (contractAddrs: string) => Promise<EtherscanContractsDto>;
      getDeployerAddress?: (contractAddress: string) => Promise<string>;
    },
    configService: ConfigService
  ): Promise<TestingModule> => {
    const newEtherscanDAO = new EtherscanDAO(configService);
    if (!!fcns.getDeployerAddress) {
      newEtherscanDAO.getDeployerAddress = fcns.getDeployerAddress;
    }
    if (!!fcns.getSourceCode) {
      newEtherscanDAO.getSourceCode = fcns.getSourceCode;
    }
    return (
      Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(EtherscanDAO)
        .useValue(newEtherscanDAO)
        // .overrideProvider(ConfigService).useValue()
        .compile()
    );
  };

  beforeEach(async () => {
    moduleRef = await getModuleRef();
    contractService = moduleRef.get<ContractService>(ContractService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    sgmAddr = configService.get('SGM_ADDRESS');
  });

  describe('verifyPauseableContract', () => {
    it(`Apply check on contract that contains pauseable contract`, async () => {
      // override getSourceCode from etherscanDAO
      const getSourceCode = async () => ({
        contracts: [
          {
            name: 'SolidGuardPauseable',
            content: solidGuardPauseable(sgmAddr),
          },
        ],
      });
      moduleRef = await getModuleRefAndOverrideEtherscanDAO(
        {
          getSourceCode,
        },
        configService
      );
      contractService = moduleRef.get<ContractService>(ContractService);
      expect(await contractService.verifyPauseableContract(tt1)).toBe(true);
    });
    it(`Apply check on contract that does not contain pauseable contract`, async () => {
      // override getSourceCode from etherscanDAO
      const getSourceCode = async () => ({
        contracts: [{ name: 'SolidGuardManager', content: solidGuardManager }],
      });
      moduleRef = await getModuleRefAndOverrideEtherscanDAO(
        {
          getSourceCode,
        },
        configService
      );
      contractService = moduleRef.get<ContractService>(ContractService);
      expect(await contractService.verifyPauseableContract(sgmAddr)).toBe(
        false
      );
    });
  });

  describe('verifyDevOfContract', () => {
    let trueSigner: ethers.Wallet;
    beforeEach(async () => {
      trueSigner = ethers.Wallet.createRandom();
      const getDeployerAddress = async () => trueSigner.address;
      moduleRef = await getModuleRefAndOverrideEtherscanDAO(
        {
          getDeployerAddress,
        },
        configService
      );
      contractService = moduleRef.get<ContractService>(ContractService);
    });
    it(`Check if signed by address of DEPLOY_PRIVATE_KEY`, async () => {
      const message = 'Welcome to Ethereum L2s!';
      const signedMessage = await trueSigner.signMessage(message);
      // override getDeployerAddress from etherscanDAO
      expect(
        await contractService.verifyDevOfContract(tt1, message, signedMessage)
      ).toBe(true);
    });
    it(`Check if not signed by address of DEPLOY_PRIVATE_KEY`, async () => {
      const randomWallet = ethers.Wallet.createRandom();
      const message = 'Welcome to Gethereum L3s!';
      const signedMessage = await randomWallet.signMessage(message);
      // override getDeployerAddress from etherscanDAO
      expect(
        await contractService.verifyDevOfContract(tt1, message, signedMessage)
      ).toBe(false);
    });
  });

  describe('createContractDB + getContractDB', () => {
    it(`Add something that can be paused`, async () => {
      // override getSourceCode to contain pauseable smart contract
      const getSourceCode = async () => ({
        contracts: [
          {
            name: 'SolidGuardPauseable',
            content: solidGuardPauseable(sgmAddr),
          },
        ],
      });
      moduleRef = await getModuleRefAndOverrideEtherscanDAO(
        {
          getSourceCode,
        },
        configService
      );
      contractService = moduleRef.get<ContractService>(ContractService);
      const addr = tt1;
      await contractService.createContractDB(addr);
      const c = await contractService.getContractDB(addr);
      expect(c.addr).toBe(addr);
      expect(c.pauseable).toBe(true);
    });
    it(`Add something that can't be paused`, async () => {
      // override getSourceCode from etherscanDAO
      const getSourceCode = async () => ({
        contracts: [{ name: 'SolidGuardManager', content: solidGuardManager }],
      });
      moduleRef = await getModuleRefAndOverrideEtherscanDAO(
        {
          getSourceCode,
        },
        configService
      );
      contractService = moduleRef.get<ContractService>(ContractService);
      const addr = tt1;
      await contractService.createContractDB(addr);
      const c = await contractService.getContractDB(addr);
      expect(c.addr).toBe(addr);
      expect(c.pauseable).toBe(false);
    });
  });

  describe('getAllContractAddrs', () => {
    beforeEach(async () => {
      const getSourceCode = async () => ({
        contracts: [{ name: 'SolidGuardManager', content: solidGuardManager }],
      });
      moduleRef = await getModuleRefAndOverrideEtherscanDAO(
        {
          getSourceCode,
        },
        configService
      );
      contractService = moduleRef.get<ContractService>(ContractService);
    });
    it(`Get 0 contract addresses`, async () => {
      const addrs = await contractService.getAllContractAddrs();
      expect(addrs.length).toBe(0);
    });
    it(`Get 1 contract address`, async () => {
      await contractService.createContractDB(tt1);
      const addrs = await contractService.getAllContractAddrs();
      expect(addrs.length).toBe(1);
    });
    it(`Get multiple contract addresses`, async () => {
      await contractService.createContractDB(tt1);
      await contractService.createContractDB(tt2);
      const addrs = await contractService.getAllContractAddrs();
      expect(addrs.length).toBe(2);
    });
  });

  describe('hasEtherscanContractsFromAddrs', () => {
    beforeEach(async () => {
      const getSourceCode = async (contractAddr: string) => {
        if (contractAddr === tt2) {
          return {
            contracts: [
              {
                name: 'SolidGuardPauseable',
                content: solidGuardPauseable(sgmAddr),
              },
              { name: 'TimelockController', content: timelockController },
            ],
          };
        } else if (contractAddr === tt1) {
          return {
            contracts: [
              {
                name: 'SolidGuardPauseable',
                content: solidGuardPauseable(sgmAddr),
              },
              {
                name: 'TestTimelockController',
                content: testTimelockController,
              },
              { name: 'TimelockController', content: timelockController },
            ],
          };
        } else if (contractAddr === sgmAddr) {
          return {
            contracts: [
              { name: 'SolidGuardManager', content: solidGuardManager },
            ],
          };
        }
        return {
          contracts: [
            {
              name: 'SolidGuardPauseable',
              content: solidGuardPauseable(sgmAddr),
            },
          ],
        };
      };
      moduleRef = await getModuleRefAndOverrideEtherscanDAO(
        {
          getSourceCode,
        },
        configService
      );
      contractService = moduleRef.get<ContractService>(ContractService);
    });
    it(`Contained in some`, async () => {
      contractService = moduleRef.get<ContractService>(ContractService);
      const affectedAddrs =
        await contractService.hasEtherscanContractsFromAddrs(
          {
            names: ['TimelockController'],
            addr: tt2,
          },
          [tt1, sgmAddr]
        );
      expect(affectedAddrs).toEqual(expect.arrayContaining([tt1]));
      expect(affectedAddrs.length).toBe(1);
    });
    it(`Contained in none`, async () => {
      contractService = moduleRef.get<ContractService>(ContractService);
      const affectedAddrs =
        await contractService.hasEtherscanContractsFromAddrs(
          {
            names: ['TimelockController'],
            addr: tt1,
          },
          [sgmAddr]
        );
      expect(affectedAddrs).toEqual(expect.arrayContaining([]));
      expect(affectedAddrs.length).toBe(0);
    });
  });

  afterEach(async () => {
    await clearDB();
  });
});
