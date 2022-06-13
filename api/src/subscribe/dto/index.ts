import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
} from 'class-validator';

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

export class CreateSubscribeRequestDto {
  @IsArray()
  @IsEmail({}, { each: true })
  @ApiProperty({
    uniqueItems: true,
    example: ['admin@coolswap.com', 'mgmt@coolswap.com', 'jane.doe@gmail.com'],
  })
  emailAddrs: string[];
  @IsArray()
  @IsEthereumAddress({ each: true })
  @ApiProperty({
    uniqueItems: true,
    example: [
      '0x664d600ea18FFf6Ec2bE5AA3682931245C683bfC',
      '0x05BA813eA8d76b1553f68A1b5dC942e71846adD9',
    ],
  })
  contractAddrs: string[];
  @IsString()
  @ApiProperty({ example: '' })
  @IsNotEmpty() // O.K. since this does not go near the database.
  signedJSON: string;
}

export class CreateSubscribeResponseDto {
  @ApiResponseProperty({
    example: ['admin@coolswap.com', 'mgmt@coolswap.com', 'jane.doe@gmail.com'],
  })
  emailAddrs: string[];
  @ApiResponseProperty({
    example: [
      '0x664d600ea18FFf6Ec2bE5AA3682931245C683bfC',
      '0x05BA813eA8d76b1553f68A1b5dC942e71846adD9',
    ],
  })
  contractAddrs: string[];
}

export class SubscriptionDto {
  emailAddrs: string;
  contractAddrs: string;
  pauseable: boolean;
  createdAt: Date;
}

export class SubscriptionsResponseDto {
  @ApiResponseProperty({
    example: [
      {
        emailAddrs: 'niceman23@gmail.com',
        contractAddrs: '0x664d600ea18FFf6Ec2bE5AA3682931245C683bfC',
        pauseable: true,
        createdAt: new Date(),
      },
      {
        emailAddrs: 'meanman23@gmail.com',
        contractAddrs: '0x05BA813eA8d76b1553f68A1b5dC942e71846adD9',
        pauseable: false,
        createdAt: new Date('December 17, 2021 03:24:00'),
      },
    ],
  })
  subscriptions: SubscriptionDto[];
  @ApiResponseProperty({
    example: 2,
  })
  total: number;

  constructor(response: SubscriptionsResponseDto) {
    Object.assign(this, response);
  }
}
