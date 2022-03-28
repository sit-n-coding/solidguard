import { Module } from '@nestjs/common';
import { EmailNotificationService } from './email-notification.service';

@Module({
  providers: [EmailNotificationService],
  exports: [EmailNotificationService],
})
export class EmailNotificationModule {}
