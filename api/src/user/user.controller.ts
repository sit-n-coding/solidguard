import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Roles } from './guard/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import {
  CreateAccountRequestDto,
  RegisterUserRequestDto,
  UserResponseDto,
} from './dto';
import { UserService } from './user.service';
import { TransformPlainToClass } from 'class-transformer';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registers a new user account.',
  })
  @ApiBody({
    description: 'Registration info for a new user account.',
    type: RegisterUserRequestDto,
  })
  @ApiCreatedResponse({
    description: 'Returns the newly registered user info.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user info for registeristration.',
  })
  @TransformPlainToClass(UserResponseDto)
  async registerUser(
    @Body() registerUserRequestDto: RegisterUserRequestDto
  ): Promise<UserResponseDto> {
    return await this.usersService.createAccount({
      email: registerUserRequestDto.email,
      password: registerUserRequestDto.password,
      role: Role.USER,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('create-new-account')
  @ApiHeader({
    name: 'Authorization',
    description:
      'The JWT of current login user that contains the username (email).',
    required: true,
  })
  @ApiBody({
    description: 'Account info for a creating a new account.',
    type: CreateAccountRequestDto,
  })
  @ApiCreatedResponse({
    description: 'Returns the newly created account info.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid account info for creation.',
  })
  @ApiUnauthorizedResponse({
    description: 'The current login user is unauthorized. ',
  })
  @TransformPlainToClass(UserResponseDto)
  async createAccount(
    @Body() accountData: CreateAccountRequestDto
  ): Promise<UserResponseDto> {
    return await this.usersService.createAccount(accountData);
  }
}
