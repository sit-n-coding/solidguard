import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SendgridProviderModule } from '../sendgrid/sendgrid.module';
import { EmailController } from './email.controller';
import { SendgridService } from './sendgrid.service';

@Module({
  imports: [SendgridProviderModule, UserModule],
  providers: [SendgridService],
  exports: [SendgridService],
  controllers: [EmailController],
})
export class EmailModule {}
