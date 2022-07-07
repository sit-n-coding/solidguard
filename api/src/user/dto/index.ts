import { Role } from '@prisma/client';
import {
  IsAlphanumeric,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

// source: https://ihateregex.io/expr/password/
// 8-20 characters, at least one upper case English letter, one lower case English letter, one number and one special character.
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/;

@InputType()
export class CreateAccountRequestDto {
  @Field()
  @IsAlphanumeric()
  name: string;

  @Field()
  @IsString()
  @Matches(passwordRegex)
  password: string;

  @Field()
  @IsEnum(Role)
  role: Role;
}

@InputType()
export class RegisterUserRequestDto {
  @Field()
  @IsAlphanumeric()
  name: string;

  @Field()
  @IsString()
  @Matches(passwordRegex)
  password: string;
}

@ObjectType()
export class UserResponseDto {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  name: string;

  @Field()
  role: Role;
}

@InputType()
export class LoginRequestDto {
  @Field()
  @IsAlphanumeric()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
