import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserResponseDto } from '../dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: false,
    });
  }

  async validate(
    userEmail: string,
    password: string
  ): Promise<UserResponseDto> {
    const user = await this.authService.validateUser(userEmail, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
