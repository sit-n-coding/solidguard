import { UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { SessionAuthGuard } from './guard/session-auth.guard';
import { Roles } from './guard/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import {
  CreateAccountRequestDto,
  RegisterUserRequestDto,
  UserResponseDto,
} from './dto';
import { UserService } from './user.service';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserId } from './guard/user-id.decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Mutation(() => UserResponseDto)
  async registerUser(
    @Args('registerUserRequest') registerUserRequestDto: RegisterUserRequestDto
  ): Promise<UserResponseDto> {
    return await this.usersService.createAccount({
      name: registerUserRequestDto.name,
      password: registerUserRequestDto.password,
      role: Role.USER,
    });
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => UserResponseDto)
  async createAccount(
    @Args('createAccountRequest') accountData: CreateAccountRequestDto
  ): Promise<UserResponseDto> {
    return await this.usersService.createAccount(accountData);
  }

  @UseGuards(SessionAuthGuard)
  @Query(() => UserResponseDto, { nullable: true }) // use seesion later, not working now
  async getProfile(@UserId() userId: string): Promise<UserResponseDto> {
    return this.usersService.getUserById(userId);
  }
}
