import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ContractFromAPIDto, EtherscanContractsDto } from './dto';

@Injectable()
export class EtherscanDAO {
  private url: string;
  private apiKey: string;
  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get<string>('ETHERSCAN_URL');
    this.apiKey = this.configService.get<string>('ETHERSCAN_API_KEY');
  }

  public async getSourceCode(
    contractAddress: string
  ): Promise<EtherscanContractsDto> {
    const res = await axios.get(
      `${this.url}/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${this.apiKey}`
    );

    if (
      res.status !== 200 ||
      res.data['status'] !== '1' ||
      !res.data['result'][0]['SourceCode']
    ) {
      throw Error('Failed to retrieve smart contract.');
    }
    return this.parseSourceCode(
      res.data['result'][0]['SourceCode'],
      res.data['result'][0]['ContractName']
    );
  }

  public async getDeployerAddress(contractAddress: string): Promise<string> {
    // Gets the first transaction
    const res = await axios.get(
      `${this.url}/api?module=account&action=txlist&address=${contractAddress}&page=1&offset=1&sort=asc&apikey=${this.apiKey}`
    );
    if (res.status !== 200 || res.data['status'] !== '1') {
      throw Error('Failed to retrieve deployer address.');
    }
    return res.data['result'][0]['from'];
  }

  private parseSourceCode(
    rawSourceCode: string,
    contractName: string
  ): EtherscanContractsDto {
    if (rawSourceCode[0] !== '{') {
      return {
        contracts: [{ name: contractName + '.sol', content: rawSourceCode }],
      };
    }
    const sourceCode = this.getSourceCodeJSON(rawSourceCode);
    return this.sourceToContracts(sourceCode);
  }

  private getSourceCodeJSON(rawSourceCode: string): JSON {
    return JSON.parse(rawSourceCode.substring(1, rawSourceCode.length - 1));
  }

  private sourceToContracts(sourceCode: JSON): EtherscanContractsDto {
    const contracts: ContractFromAPIDto[] = [];
    for (const key of Object.keys(sourceCode['sources'])) {
      contracts.push({
        name: key,
        content: sourceCode['sources'][key]['content'],
      });
    }
    return {
      evmVersion: sourceCode['settings']['evmVersion'],
      libraries: sourceCode['settings']['libraries'],
      contracts,
    };
  }
}
