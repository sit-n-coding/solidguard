import { Controller, Request, Post, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { LoginUserRequestDto, UserResponseDto } from './dto';
import { LoginUserJwtTokenResponse } from './dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Logins a user.',
  })
  @ApiBody({
    description: 'User information to login.',
    type: LoginUserRequestDto,
  })
  @ApiCreatedResponse({
    description: 'Returns the JWT for current login user.',
    type: LoginUserJwtTokenResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user info for login.',
  })
  @ApiNotFoundResponse({
    description: 'User info not found in the database.',
  })
  async login(@Request() req): Promise<LoginUserJwtTokenResponse> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiHeader({
    name: 'Authorization',
    description:
      'The JWT of current login user that contains the username (email).',
    required: true,
  })
  @ApiBody({
    description: 'Valid JWT of current login user.',
    type: LoginUserRequestDto,
  })
  @ApiOkResponse({
    description: 'Returns the current login user account info.',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No user logon.',
  })
  getProfile(@Request() req): Promise<UserResponseDto> {
    return req.user;
  }
}
