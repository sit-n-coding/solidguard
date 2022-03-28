import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ContractFromAPIDto, GithubContractInfoDto } from './dto';

@Injectable()
export class GithubDAO {
  private readonly url: string = 'https://api.github.com/';
  private apiKey: string;
  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GITHUB_API_KEY');
  }

  public async getSourceCode(
    info: GithubContractInfoDto
  ): Promise<ContractFromAPIDto> {
    const res = await axios.get(
      `${this.url}repos/${info.author}/${info.repo}/contents/${info.path}?ref=${info.ref}`
    );
    if (res.status !== 200 && res.data['type'] !== 'file') {
      throw Error('Failed to retrieve smart contract.');
    }
    return {
      name: res.data['name'],
      content: atob(res.data['content'].replace(/\s+/g, '')),
    };
  }
}
