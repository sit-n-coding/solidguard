import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
import { TransformPlainToClass } from 'class-transformer';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
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
    description: `Registration info for a new user account. 
      Password must have 8-20 characters, 
      at least one upper case English letter, one lower case English letter, 
      one number and one special character from [#?!@$ %^&*-].`,
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
      name: registerUserRequestDto.name,
      password: registerUserRequestDto.password,
      role: Role.USER,
    });
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('create')
  @ApiBody({
    description: `Account info for a creating a new account. 
      Password must have 8-20 characters, at least one upper case English letter, 
      one lower case English letter, one number and one special character from 
      [#?!@$ %^&*-].`,
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
    description: 'The current login user is unauthorized.',
  })
  @TransformPlainToClass(UserResponseDto)
  async createAccount(
    @Body() accountData: CreateAccountRequestDto
  ): Promise<UserResponseDto> {
    return await this.usersService.createAccount(accountData);
  }

  @UseGuards(SessionAuthGuard)
  @Get()
  @ApiOkResponse({
    description: "Returns the current login user's account info.",
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No user logon.',
  })
  getProfile(
    @Req() req: Request & { userId: string }
  ): Promise<UserResponseDto> {
    return this.usersService.getUserById(req.userId);
  }
}
