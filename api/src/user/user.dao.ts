import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateAccountRequestDto } from './dto';

@Injectable()
export class UserDAO {
  private readonly saltRounds = 10;
  constructor(private prisma: PrismaService) {}

  async getById(userId: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async getByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(accountData: CreateAccountRequestDto): Promise<User> {
    const hash = bcrypt.hashSync(accountData.password, this.saltRounds);
    return await this.prisma.user.create({
      data: {
        email: accountData.email,
        password: hash,
        role: accountData.role,
      },
    });
  }
}
