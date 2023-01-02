import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDAO } from './user.dao';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { SessionAuthGuard } from './guard/session-auth.guard';
import { RolesGuard } from './guard/roles.guard';

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
  controllers: [UserController, AuthController],
  providers: [UserService, UserDAO, AuthService, RolesGuard, SessionAuthGuard],
  exports: [RolesGuard, SessionAuthGuard, UserService, AuthService],
})
export class UserModule {}
