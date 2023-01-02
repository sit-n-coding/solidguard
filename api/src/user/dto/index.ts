import { Role } from '@prisma/client';
import {
  IsAlphanumeric,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// source: https://ihateregex.io/expr/password/
// 8-20 characters, at least one upper case English letter, one lower case English letter, one number and one special character.
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/;

export class CreateAccountRequestDto {
  @IsAlphanumeric()
  @ApiProperty({
    example: 'bot',
  })
  name: string;
  @IsString()
  @Matches(passwordRegex)
  @ApiProperty({
    example: 'Hell0@W0rld!',
  })
  password: string;
  @IsEnum(Role)
  @ApiProperty({ enum: Role })
  role: Role;
}

export class RegisterUserRequestDto {
  @IsAlphanumeric()
  @ApiProperty({
    example: 'bot',
  })
  name: string;
  @IsString()
  @Matches(passwordRegex)
  @ApiProperty({
    example: 'Hell0@W0rld!',
  })
  password: string;
}

@Expose()
export class UserResponseDto {
  @ApiProperty({ example: 'bfe1a66d-e923-425e-8f67-107e2dd93a3b' })
  id: string;
  @ApiProperty({ example: '2022-05-29T03:23:12.250Z' })
  createdAt: Date;
  @ApiProperty({ example: 'bot' })
  name: string;
  @ApiProperty({ example: 'USER' })
  role: Role;
  @Exclude()
  password?: string;
}

export class LoginRequestDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  @ApiProperty({
    example: 'bot',
  })
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Hell0@W0rld!',
  })
  password: string;
}
