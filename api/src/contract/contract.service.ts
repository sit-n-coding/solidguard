import { Inject, Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { EtherscanDAO } from './etherscan.dao';
import { ConfigService } from '@nestjs/config';
import { solidGuardManagerABI } from '../source/solid-guard-manager.abi';
import {
  ContractDto,
  ContractFromAPIDto,
  EtherscanContractsDto,
  EtherscanContractInfoDto,
} from './dto';
import { ContractDAO } from './contract.dao';
import { solidGuardPauseable } from '../source/solid-guard-pauseable';

@Injectable()
export class ContractService {
  private solidGuardPauseable: ContractFromAPIDto;
  private solidGuardManager: Contract;
  constructor(
    @Inject('ETHProvider')
    private readonly provider: ethers.providers.BaseProvider,
    private readonly contractDAO: ContractDAO,
    private readonly etherscanDAO: EtherscanDAO,
    configService: ConfigService
  ) {
    // get source code without whitespace
    this.solidGuardPauseable = {
      name: 'SolidGuardPauseable',
      content: solidGuardPauseable(configService.get<string>('SGM_ADDRESS')),
    };

    // get contract
    this.solidGuardManager = new ethers.Contract(
      configService.get<string>('SGM_ADDRESS'),
      solidGuardManagerABI,
      this.provider
    );
    // connect to contract as the owner
    const manager = new ethers.Wallet(
      configService.get<string>('DEPLOY_PRIVATE_KEY'),
      this.provider
    );
    this.solidGuardManager = this.solidGuardManager.connect(manager);
  }

  public async verifyDevOfContract(
    contractAddr: string,
    message: string,
    signature: string
  ): Promise<boolean> {
    try {
      const deployerAddr = await this.etherscanDAO.getDeployerAddress(
        contractAddr
      );
      const signerAddr = ethers.utils.verifyMessage(message, signature);
      return deployerAddr.toLowerCase() === signerAddr.toLowerCase();
    } catch (e) {
      return false;
    }
  }

  public async verifyPauseableContract(contractAddr: string): Promise<boolean> {
    return this.hasContractsFromAddr([this.solidGuardPauseable], contractAddr);
  }

  public async createContractDB(addr: string): Promise<ContractDto> {
    const pauseable = await this.verifyPauseableContract(addr);
    return this.contractDAO.create({ addr, pauseable });
  }

  public async getContractDB(addr: string): Promise<ContractDto> {
    return this.contractDAO.getByAddr(addr);
  }

  public async pauseContracts(contractAddrs: string[]): Promise<string[]> {
    // check if the contract addresses are pauseable
    const pauseAddrPromises: Promise<void>[] = [];
    const pauseableContractAddrs: string[] = [];
    for (const addr of contractAddrs) {
      pauseAddrPromises.push(
        (async () => {
          if ((await this.solidGuardManager.getPauses(addr)).gt(0)) {
            pauseableContractAddrs.push(addr);
          }
        })()
      );
    }

    // pause only those that are pauseable
    await Promise.all(pauseAddrPromises);
    await this.solidGuardManager.batchPause(pauseableContractAddrs);
    return pauseableContractAddrs;
  }

  public async isValidEtherscanContracts(
    esInfo: EtherscanContractInfoDto
  ): Promise<boolean> {
    try {
      const contractRes = await this.etherscanDAO.getSourceCode(esInfo.addr);
      let counter = 0; // can use counter method since all contract names must be unique
      for (const contract of contractRes.contracts) {
        if (esInfo.names.includes(contract.name)) {
          counter++;
        }
      }
      return counter === esInfo.names.length;
    } catch {
      return false;
    }
  }

  public async hasEtherscanContractsFromAddrs(
    esInfo: EtherscanContractInfoDto,
    contractAddrs: string[]
  ): Promise<string[]> {
    // get source code from etherscan
    const contractRes: EtherscanContractsDto =
      await this.etherscanDAO.getSourceCode(esInfo.addr);
    const targetContracts: ContractFromAPIDto[] = [];

    // check if valid
    for (const contract of contractRes.contracts) {
      if (esInfo.names.includes(contract.name)) {
        targetContracts.push(contract);
      }
    }
    if (targetContracts.length !== esInfo.names.length)
      throw new Error('Contracts does not exist.');

    // get addresses that has this code
    const containPromises: Promise<void>[] = [];
    const containsContractAddrs: string[] = [];
    for (const contractAddr of contractAddrs) {
      containPromises.push(
        (async () => {
          if (await this.hasContractsFromAddr(targetContracts, contractAddr)) {
            containsContractAddrs.push(contractAddr);
          }
        })()
      );
    }
    await Promise.all(containPromises);
    return containsContractAddrs;
  }

  public async getAllContractAddrs(): Promise<string[]> {
    const contracts = await this.contractDAO.getAll();
    return contracts.map((contractDto) => contractDto.addr);
  }

  private async hasContractsFromAddr(
    targetContracts: ContractFromAPIDto[],
    contractAddr: string
  ): Promise<boolean> {
    // get etherscan source code
    let esContract: EtherscanContractsDto;
    try {
      esContract = await this.etherscanDAO.getSourceCode(contractAddr);
    } catch (e) {
      console.error(e);
      return false;
    }

    // check if it has source codes
    let counter = 0;
    for (const contract of esContract.contracts) {
      for (const contractTarget of targetContracts) {
        if (this.hasContract(contractTarget.content, contract.content)) {
          counter++;
        }
      }
    }
    return counter === targetContracts.length;
  }

  private hasContract(sourceCode1: string, sourceCode2: string): boolean {
    return sourceCode1.replace(/\s+/, '') === sourceCode2.replace(/\s+/, '');
  }
}
