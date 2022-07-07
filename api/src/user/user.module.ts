import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDAO } from './user.dao';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SessionAuthGuard } from './guard/session-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { AuthResolver } from './auth.resolver';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_TIME,
      },
    }),
  ],
  providers: [
    UserService,
    UserDAO,
    AuthService,
    RolesGuard,
    SessionAuthGuard,
    AuthResolver,
    UserResolver,
  ],
  exports: [RolesGuard, SessionAuthGuard, UserService, AuthService],
})
export class UserModule {}
