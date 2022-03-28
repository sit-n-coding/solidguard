import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from './dto';
import { TransformPlainToClass } from 'class-transformer';
import { LoginUserJwtTokenResponse } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  @TransformPlainToClass(UserResponseDto)
  async validateUser(email: string, pass: string): Promise<UserResponseDto> {
    const user = await this.usersService.getUserByEmail(email);
    if (user && bcrypt.compareSync(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: any): Promise<LoginUserJwtTokenResponse> {
    const payload = { userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
