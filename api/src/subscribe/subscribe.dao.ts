import { Injectable } from '@nestjs/common';
import { Subscribe } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SubscribeDAO {
  constructor(private prisma: PrismaService) {}

  async create(email: string, contract: string, userId: string) {
    await this.prisma.subscribe.create({
      data: {
        emailAddr: email,
        contractAddr: contract,
        userId,
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

  async getSubscribeByUser(userId: string, page: number): Promise<Subscribe[]> {
    return this.prisma.subscribe.findMany({
      where: {
        userId: userId,
      },
      skip: (page.valueOf() - 1) * 10,
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getSubscribeCountByUser(userId: string): Promise<number> {
    return this.prisma.subscribe.count({
      where: {
        userId: userId,
      },
    });
  }
}
