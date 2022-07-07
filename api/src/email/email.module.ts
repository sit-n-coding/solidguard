import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SendgridProviderModule } from '../sendgrid/sendgrid.module';
import { SendgridService } from './sendgrid.service';

@Module({
  imports: [SendgridProviderModule, UserModule],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class EmailModule {}
