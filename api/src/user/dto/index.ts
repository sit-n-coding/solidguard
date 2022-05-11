import { Role } from '@prisma/client';
import {
  IsAlphanumeric,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

// source: https://ihateregex.io/expr/password/
// 8-20 characters, at least one upper case English letter, one lower case English letter, one number and one special character.
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/;

export class CreateAccountRequestDto {
  @IsAlphanumeric()
  @ApiProperty({
    example: 'coolswap',
  })
  name: string;
  @IsString()
  @Matches(passwordRegex)
  @ApiProperty({
    example: 'pass',
  })
  password: string;
  @IsEnum(Role)
  @ApiProperty({ enum: Role })
  role: Role;
}

export class RegisterUserRequestDto {
  @IsAlphanumeric()
  @ApiProperty({
    example: 'coolswap',
  })
  name: string;
  @IsString()
  @Matches(passwordRegex)
  @ApiProperty({
    example: 'pass',
  })
  password: string;
}

@Expose()
export class UserResponseDto {
  id: string;
  createdAt: Date;
  name: string;
  role: Role;
  @Exclude()
  password?: string;
}

export class LoginRequestDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  @ApiProperty({
    example: 'coolswap',
  })
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'pass',
  })
  password: string;
}
