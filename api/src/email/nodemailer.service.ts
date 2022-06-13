import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ExploitResponseDto } from '../exploit/dto';
import { emailHTML } from '../source/email';

// TODO: Keep or remove?
//This part is used to test this single file

@Injectable()
export class NodemailerService {
  constructor(private readonly configService: ConfigService) {}

  /*This function takes in a data for exploits and also a list of strings containing receiver emails
   */
  async sendEmail(receiverEmails: string[], exploitDto: ExploitResponseDto) {
    let finaluser: string;
    let finalpw: string;
    let finalservice: string;
    if (
      !this.configService.get('EMAIL_USER') ||
      !this.configService.get('EMAIL_PASSWORD') ||
      !this.configService.get('EMAIL_SERVICE')
    ) {
      const testAccount = await nodemailer.createTestAccount(); //test account
      finaluser = testAccount.user; // generated ethereal user
      finalpw = testAccount.pass; // generated ethereal password
    } else {
      finaluser = this.configService.get<string>('EMAIL_USER');
      finalpw = this.configService.get<string>('EMAIL_PASSWORD');
      finalservice = this.configService.get<string>('EMAIL_SERVICE');
    }
    const transporter = nodemailer.createTransport({
      service: finalservice,
      host: this.configService.get<string>('TRANS_HOST'),
      //host: "smtp.ethereal.email", //use this to test
      port: this.configService.get<number>('TRANS_PORT'),
      //port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: finaluser,
        pass: finalpw,
      },
      logger: true,
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"SolidGuard" ${this.configService.get<string>('EMAIL_USER')}`,
      bcc: receiverEmails, //could be list of receivers
      subject: `SolidGuard: ${exploitDto.name}`,
      html: emailHTML(exploitDto),
    });

    console.log('Message sent: %s', info.response);
    console.log('Message sent: %s', info.messageId);

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
