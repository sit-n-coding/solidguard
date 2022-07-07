import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionAuthGuard } from './guard/session-auth.guard';
import { LoginRequestDto } from './dto';
import { CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { Session } from './guard/session.decorator';

@Resolver()
export class AuthResolver {
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

  @Mutation(() => Boolean)
  async login(
    @Args('loginRequest') body: LoginRequestDto,
    @Session() session: Record<string, any>,
    @Context() context: ExpressContext
  ): Promise<boolean> {
    const user = await this.authService.validateUser(body.name, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }

    // set userId session
    session.userId = user.id;

    // create new cookie
    context.res.cookie('userId', user.id, this.cookieOptions);
    context.res.cookie('role', user.role, this.cookieOptions);
    return true;
  }

  @UseGuards(SessionAuthGuard)
  @Mutation(() => Boolean)
  async logout(
    @Session() session: Record<string, any>,
    @Context() context: ExpressContext
  ): Promise<boolean> {
    session.userId = null;
    context.res.clearCookie('userId', this.cookieOptions);
    context.res.clearCookie('role', this.cookieOptions);
    return true;
  }
}
