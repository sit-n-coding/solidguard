import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractDAO } from './contract.dao';
import { EtherscanDAO } from './etherscan.dao';
import { GithubDAO } from './github.dao';
import { ETHProviderModule } from '../eth-provider/eth-provider.module';

@Module({
  imports: [ETHProviderModule],
  providers: [EtherscanDAO, ContractDAO, GithubDAO, ContractService],
  exports: [ContractService],
})
export class ContractModule {}
