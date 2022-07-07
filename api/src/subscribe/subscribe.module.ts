import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeDAO } from './subscribe.dao';
import { ContractModule } from '../contract/contract.module';
import { SubscribeResolver } from './subscribe.resolver';

@Module({
  imports: [ContractModule],
  providers: [SubscribeService, SubscribeDAO, SubscribeResolver],
  exports: [SubscribeService],
})
export class SubscribeModule {}
