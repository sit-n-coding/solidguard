import { ForbiddenException, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from '../user/guard/session-auth.guard';
import { UserId } from '../user/guard/user-id.decorator';
import { ContractService } from '../contract/contract.service';
import {
  CreateSubscribeRequestDto,
  CreateSubscribeResponseDto,
  SubscriptionsResponseDto,
} from './dto';
import { SubscribeService } from './subscribe.service';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

@Resolver()
export class SubscribeResolver {
  constructor(
    private readonly subscribeService: SubscribeService,
    private readonly contractService: ContractService
  ) {}

  private getMessage(contractAddrs: string[], emailAddrs: string[]): string {
    return JSON.stringify({ contractAddrs, emailAddrs });
  }

  private async verifyDev(
    addr: string,
    message: string,
    signedJSON: string
  ): Promise<void> {
    if (
      !(await this.contractService.verifyDevOfContract(
        addr,
        message.replace(/\s+/, ''),
        signedJSON
      ))
    ) {
      throw new ForbiddenException('Unable to verify author.');
    }
  }

  private async updateContractDB(addr: string): Promise<void> {
    let contract = await this.contractService.getContractDB(addr);
    if (!contract) {
      contract = await this.contractService.createContractDB(addr);
    }
  }

  @UseGuards(SessionAuthGuard)
  @Mutation(() => CreateSubscribeResponseDto)
  async createSubscribe(
    @UserId() userId: string,
    @Args('createSubscribeRequest') bodyReq: CreateSubscribeRequestDto
  ): Promise<CreateSubscribeResponseDto> {
    // create message
    const message = this.getMessage(bodyReq.contractAddrs, bodyReq.emailAddrs);

    // check validity
    const validityPromises: Promise<void>[] = [];
    for (const addr of bodyReq.contractAddrs) {
      validityPromises.push(
        (async () => {
          await this.verifyDev(addr, message, bodyReq.signedJSON);
          await this.updateContractDB(addr);
        })()
      );
    }
    await Promise.all(validityPromises);

    // create subscribe instances in db
    return await this.subscribeService.createSubscribe({
      contractAddrs: bodyReq.contractAddrs,
      emailAddrs: bodyReq.emailAddrs,
      userId,
    });
  }

  @UseGuards(SessionAuthGuard)
  @Query(() => SubscriptionsResponseDto)
  async getSubscriptions(
    @UserId() userId: string,
    @Args('page') page: number
  ): Promise<SubscriptionsResponseDto> {
    const subscribes = await this.subscribeService.getSubscribeByUser(
      userId,
      page
    );
    const dslst = [];
    for (const sub of subscribes) {
      const contract = await this.contractService.getContractDB(
        sub.contractAddr
      );
      const ds = {
        emailAddr: sub.emailAddr,
        contractAddr: sub.contractAddr,
        pausable: contract.pauseable,
        createdAt: sub.createdAt,
      };
      dslst.push(ds);
    }
    const total = await this.subscribeService.getSubscribeCountByUser(userId);

    return new SubscriptionsResponseDto({
      subscriptions: dslst,
      total,
    });
  }
}
