import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ContractService } from '../contract/contract.service';
import { CreateSubscribeRequestDto, CreateSubscribeResponseDto } from './dto';
import { SubscribeService } from './subscribe.service';

@ApiTags('subscribe')
@Controller('subscribe')
export class SubscribeController {
  constructor(
    private readonly subscribeService: SubscribeService,
    private readonly contractService: ContractService
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Subscribes the given email addresses to each smart contract.',
  })
  @ApiCreatedResponse({
    description: 'Returns the email and smart contract addresses.',
    type: CreateSubscribeResponseDto,
  })
  @ApiForbiddenResponse({
    description: "Signer's address does not match with the deployer's address.",
  })
  async createSubscribe(
    @Body() bodyReq: CreateSubscribeRequestDto
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
    });
  }

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
        message.replace(/\s+/g, ''),
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
}
