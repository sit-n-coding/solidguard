import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Module({
  providers: [
    {
      provide: 'ETHProvider',
      useFactory: (configService: ConfigService) =>
        new ethers.providers.JsonRpcProvider(
          configService.get<string>('PROVIDER_URL')
        ),
      inject: [ConfigService],
    },
  ],
  exports: ['ETHProvider'],
})
export class ETHProviderModule {}
