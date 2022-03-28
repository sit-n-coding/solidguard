import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDAO } from './user.dao';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { LocalStrategy } from './strategy/local.strategy';

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
  providers: [
    UserService,
    UserDAO,
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RolesGuard,
    LocalAuthGuard,
    JwtAuthGuard,
  ],
  exports: [RolesGuard, JwtAuthGuard, LocalAuthGuard, UserService, AuthService],
})
export class UserModule {}
