import { Inject, Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { EtherscanDAO } from './etherscan.dao';
import { ConfigService } from '@nestjs/config';
import { solidGuardManagerABI } from '../source/solid-guard-manager.abi';
import {
  ContractDto,
  ContractFromAPIDto,
  EtherscanContractsDto,
  GithubContractInfoDto,
} from './dto';
import { ContractDAO } from './contract.dao';
import { GithubDAO } from './github.dao';
import { solidGuardPauseable } from '../source/solid-guard-pauseable';

@Injectable()
export class ContractService {
  private solidGuardPauseable: string;
  private solidGuardManager: Contract;
  constructor(
    @Inject('ETHProvider')
    private readonly provider: ethers.providers.BaseProvider,
    private readonly contractDAO: ContractDAO,
    private readonly etherscanDAO: EtherscanDAO,
    private readonly githubDAO: GithubDAO,
    configService: ConfigService
  ) {
    // get source code without whitespace
    this.solidGuardPauseable = solidGuardPauseable(
      configService.get<string>('SGM_ADDRESS')
    );

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
    return this.hasContractFromAddr(this.solidGuardPauseable, contractAddr);
  }

  public async createContractDB(addr: string): Promise<ContractDto> {
    const pause = await this.verifyPauseableContract(addr);
    return this.contractDAO.create({ addr, pause });
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

  public async isValidGithubContract(
    githubInfo: GithubContractInfoDto
  ): Promise<boolean> {
    if (!githubInfo.path.match(/.+\.sol$/g)) {
      return false;
    }
    try {
      return !!(await this.githubDAO.getSourceCode(githubInfo));
    } catch {
      return false;
    }
  }

  public async hasGithubContractFromAddrs(
    githubInfo: GithubContractInfoDto,
    contractAddrs: string[]
  ): Promise<string[]> {
    // get github source code
    const ghSourceCode: ContractFromAPIDto = await this.githubDAO.getSourceCode(
      githubInfo
    );

    // get addresses that has this code
    const containPromises: Promise<void>[] = [];
    const containsContractAddrs: string[] = [];
    for (const contractAddr of contractAddrs) {
      containPromises.push(
        (async () => {
          if (
            await this.hasContractFromAddr(ghSourceCode.content, contractAddr)
          ) {
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

  private async hasContractFromAddr(
    sourceCode: string,
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

    // check if it has source code
    for (const contract of esContract.contracts) {
      if (this.hasContract(sourceCode, contract.content)) {
        return true;
      }
    }
    return false;
  }

  private hasContract(sourceCode1: string, sourceCode2: string): boolean {
    return sourceCode1.replace(/\s+/g, '') === sourceCode2.replace(/\s+/g, '');
  }
}
