import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Module({
  providers: [
    {
      provide: 'SendGridProvider',
      useFactory: (configService: ConfigService) =>
        sgMail.setApiKey(configService.get<string>('SENDGRID_API_KEY')),
      inject: [ConfigService],
    },
  ],
  exports: ['SendGridProvider'],
})
export class SendgridProviderModule {}
