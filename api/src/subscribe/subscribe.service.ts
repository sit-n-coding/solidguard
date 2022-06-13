import { Injectable } from '@nestjs/common';
import { CreateSubscribeDto, SubscribeDto } from './dto';
import { SubscribeDAO } from './subscribe.dao';
@Injectable()
export class SubscribeService {
  constructor(private readonly subscribeDAO: SubscribeDAO) {}

  async createSubscribe(
    createSubscribeDto: CreateSubscribeDto
  ): Promise<CreateSubscribeDto> {
    const createPromises: Promise<void>[] = [];
    for (const email of createSubscribeDto.emailAddrs) {
      for (const contract of createSubscribeDto.contractAddrs) {
        createPromises.push(
          (async () => {
            try {
              await this.subscribeDAO.create(
                email,
                contract,
                createSubscribeDto.userId
              );
            } catch (e) {
              console.error(e);
            }
          })()
        );
      }
    }
    await Promise.all(createPromises);
    return createSubscribeDto;
  }

  async getContractsByEmail(emailAddr: string): Promise<string[]> {
    const sublst = await this.subscribeDAO.getContractsByEmail(emailAddr);
    const strlst = [];
    for (const sub of sublst) {
      strlst.push(sub.contractAddr);
    }
    return strlst;
  }

  async getEmailsByContract(contractAddr: string): Promise<string[]> {
    const sublst = await this.subscribeDAO.getEmailsByContract(contractAddr);
    const strlst = [];
    for (const sub of sublst) {
      strlst.push(sub.emailAddr);
    }
    return strlst;
  }

  async getSubscribeByUser(
    userId: string,
    page: number
  ): Promise<SubscribeDto[]> {
    return await this.subscribeDAO.getSubscribeByUser(userId, page);
  }

  async getSubscribeCountByUser(userId: string): Promise<number> {
    return await this.subscribeDAO.getSubscribeCountByUser(userId);
  }
}
