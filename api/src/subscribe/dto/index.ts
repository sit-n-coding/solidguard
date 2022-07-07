import {
  IsArray,
  IsEmail,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

export class SubscribeDto {
  emailAddr: string;
  contractAddr: string;
  userId: string;
  createdAt: Date;
}

export class CreateSubscribeDto {
  emailAddrs: string[];
  contractAddrs: string[];
  userId: string;
}

@InputType()
export class CreateSubscribeRequestDto {
  @Field(() => [String])
  @IsArray()
  @IsEmail({}, { each: true })
  emailAddrs: string[];

  @Field(() => [String])
  @IsArray()
  @IsEthereumAddress({ each: true })
  contractAddrs: string[];

  @Field()
  @IsString()
  @IsNotEmpty() // O.K. since this does not go near the database.
  signedJSON: string;
}

@ObjectType()
export class CreateSubscribeResponseDto {
  @Field(() => [String])
  emailAddrs: string[];

  @Field(() => [String])
  contractAddrs: string[];
}

@ObjectType()
export class SubscriptionDto {
  @Field()
  emailAddrs: string;
  @Field()
  contractAddrs: string;
  @Field()
  pauseable: boolean;
  @Field()
  createdAt: Date;
}

@ObjectType()
export class SubscriptionsResponseDto {
  @Field(() => [SubscriptionDto])
  subscriptions: SubscriptionDto[];

  @Field()
  total: number;

  constructor(response: SubscriptionsResponseDto) {
    Object.assign(this, response);
  }
}
