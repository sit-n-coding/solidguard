import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { ExploitResponseDto } from '../exploit/dto';
import { emailHTML } from '../source/email';
import { MailService } from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('SendGridProvider')
    private readonly sgMail: MailService
  ) {}

  async sendEmail(receiverEmails: string[], exploitDto: ExploitResponseDto) {
    const domain = this.configService.get<string>('SENDGRID_DOMAIN');
    const msg = {
      personalizations: receiverEmails.map((email) => ({ to: { email } })),
      subject: `SolidGuard: ${exploitDto.name}`,
      from: `api@${domain}`,
      html: emailHTML(exploitDto),
    };
    const res = (await this.sgMail.send(msg))[0];

    console.log(
      `Email sent for the exploit ${exploitDto.name}. Status code: ${res.statusCode}`
    );
  }
}
