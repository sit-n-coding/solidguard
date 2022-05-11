import {
  Controller,
  Post,
  UseGuards,
  UnauthorizedException,
  Body,
  Session,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionAuthGuard } from './guard/session-auth.guard';
import { LoginRequestDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('authorization')
@Controller('auth')
export class AuthController {
  private cookieOptions: CookieOptions = {
    path: '/',
    sameSite: 'lax', // lax if cookie, strict if session
    httpOnly: false, // false if cookie, true if session
    secure: false, // true if SECURE env is true
    maxAge: null, // specified in MAX_AGE env
  };

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    this.cookieOptions.secure =
      this.configService.get('SECURE') &&
      this.configService.get('SECURE') === 'true';
    this.cookieOptions.maxAge = this.configService.get<number>('MAX_AGE');
  }

  @Post('login')
  @ApiOperation({
    summary: 'Logins a user.',
  })
  @ApiBody({
    description: 'User information to login.',
    type: LoginRequestDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user info for login.',
  })
  @ApiNotFoundResponse({
    description: 'User info not found in the database.',
  })
  async login(
    @Body() body: LoginRequestDto,
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const user = await this.authService.validateUser(body.name, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    // set userId session
    session.userId = user.id;

    // create new cookie
    res.cookie('userId', user.id, this.cookieOptions);
    res.cookie('role', user.role, this.cookieOptions);
  }

  @UseGuards(SessionAuthGuard)
  @Post('logout')
  @ApiOperation({
    summary: 'Logs out the user and clears any relevant cookies',
  })
  @ApiUnauthorizedResponse({
    description: 'No user logon.',
  })
  logout(
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) res: Response
  ): void {
    session.userId = null;
    res.clearCookie('userId', this.cookieOptions);
    res.clearCookie('role', this.cookieOptions);
  }
}
