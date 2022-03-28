import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class LoginUserJwtTokenResponse {
  @ApiResponseProperty()
  access_token: string;
}

export class LoginUserRequestDto {
  @IsEmail()
  @ApiProperty({
    example: 'admin@coolswap.com',
  })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'pass',
  })
  password: string;
}

export class JwtPayloadDto {
  userId: string;
}

export class CreateAccountRequestDto {
  @IsEmail()
  @ApiProperty({
    example: 'admin@coolswap.com',
  })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'pass',
  })
  password: string;
  @IsEnum(Role)
  @ApiProperty({ enum: Role })
  role: Role;
}

export class RegisterUserRequestDto {
  @IsEmail()
  @ApiProperty({
    example: 'admin@coolswap.com',
  })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'pass',
  })
  password: string;
}

@Expose()
export class UserResponseDto {
  id: string;
  createdAt: Date;
  email: string;
  role: Role;
  @Exclude()
  password?: string;
}
