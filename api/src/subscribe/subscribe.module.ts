import { Module } from '@nestjs/common';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import { SubscribeDAO } from './subscribe.dao';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [ContractModule],
  controllers: [SubscribeController],
  providers: [SubscribeService, SubscribeDAO],
  exports: [SubscribeService],
})
export class SubscribeModule {}
