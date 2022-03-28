import { Injectable } from '@nestjs/common';
import { Contract } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ContractDto, UpdateContractDto } from './dto';

@Injectable()
export class ContractDAO {
  constructor(private prisma: PrismaService) {}

  async create(contractDto: ContractDto): Promise<Contract> {
    return this.prisma.contract.create({
      data: contractDto,
    });
  }

  async getByAddr(addr: string): Promise<Contract> {
    return this.prisma.contract.findUnique({
      where: { addr },
    });
  }

  public async update(
    addr: string,
    data: UpdateContractDto
  ): Promise<Contract> {
    return this.prisma.contract.update({ where: { addr }, data });
  }

  async getAll(): Promise<Contract[]> {
    return this.prisma.contract.findMany({ orderBy: { addr: 'asc' } });
  }
}
