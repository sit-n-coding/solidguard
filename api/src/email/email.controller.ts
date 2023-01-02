import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../user/guard/roles.guard';
import { SessionAuthGuard } from '../user/guard/session-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from '../user/guard/roles.decorator';
import { SendgridService } from './sendgrid.service';
import { EmailRequestDto } from './dto';
import { ExploitResponseDto } from '../exploit/dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly es: SendgridService) {}

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('test')
  async sendTest(@Body() req: EmailRequestDto) {
    const exploit: ExploitResponseDto = {
      id: '?',
      name: 'Test Exploit',
      authorName: 'The SolidGuard Foundation',
      description: 'This is a test exploit to test the email service.',
      targetAddr: 'N/A',
      targetNames: [],
      verified: false,
    };
    await this.es.sendEmail(req.emails, exploit);
  }
}
