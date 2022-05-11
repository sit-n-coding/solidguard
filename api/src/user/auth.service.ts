import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from './dto';
import { TransformPlainToClass } from 'class-transformer';
import { UserDAO } from './user.dao';

@Injectable()
export class AuthService {
  // TODO: Refactor service classes out of this one.
  constructor(private userDAO: UserDAO, private jwtService: JwtService) {}

  @TransformPlainToClass(UserResponseDto)
  async validateUser(name: string, pass: string): Promise<UserResponseDto> {
    const user = await this.userDAO.getByName(name);
    if (user && bcrypt.compareSync(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: any): Promise<string> {
    const payload = { userId: user.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }
}
