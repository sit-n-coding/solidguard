import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { ContractModule } from './contract/contract.module';
import { ExploitModule } from './exploit/exploit.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuardBehindProxy } from './throttler/throttler.guard';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(__dirname, './src/schema.gql'),
      sortSchema: true,
      driver: ApolloDriver,
      outputAs: 'class',
      // cookies issue w gQL: https://github.com/nestjs/graphql/issues/119
      context: ({ req, res }) => ({ req, res }),
      // session issue w gQL: https://github.com/nestjs/graphql/issues/1121
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    }),
    ThrottlerModule.forRootAsync({
      useFactory: async (conf: ConfigService) => ({
        ttl: conf.get<number>('THROTTLER_TTL'),
        limit: conf.get<number>('THROTTLER_LIMIT'),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ContractModule,
    ExploitModule,
    SubscribeModule,
    EmailModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuardBehindProxy,
    },
  ],
})
export class AppModule {}
