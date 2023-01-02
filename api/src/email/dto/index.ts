import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayMinSize, IsEmail } from 'class-validator';

export class EmailRequestDto {
  @IsArray()
  @ApiProperty({ example: ['admin@solidguard.org', 'hello@world.com'] })
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  emails: string[];
}
