import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateAccountRequestDto } from './dto';
import { UserDAO } from './user.dao';

@Injectable()
export class UserService {
  constructor(private userDAO: UserDAO) {}

  async getUserById(userId: string): Promise<User> {
    return await this.userDAO.getById(userId);
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userDAO.getByName(email);
  }

  async createAccount(accountData: CreateAccountRequestDto): Promise<User> {
    return await this.userDAO.create(accountData);
  }
}
