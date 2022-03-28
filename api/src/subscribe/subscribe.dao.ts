import { Injectable } from '@nestjs/common';
import { Subscribe } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SubscribeDAO {
  constructor(private prisma: PrismaService) {}

  async create(email: string, contract: string) {
    await this.prisma.subscribe.create({
      data: {
        emailAddr: email,
        contractAddr: contract,
      },
    });
  }

  async getContractsByEmail(emailAddr: string): Promise<Subscribe[]> {
    return this.prisma.subscribe.findMany({
      where: {
        emailAddr: emailAddr,
      },
    });
  }

  async getEmailsByContract(contractAddr: string): Promise<Subscribe[]> {
    return this.prisma.subscribe.findMany({
      where: {
        contractAddr: contractAddr,
      },
    });
  }
}
