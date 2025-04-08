import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('email')
@ApiTags('email')
export class EmailSenderController {
  constructor(private readonly emailSenderService: EmailSenderService) {}

  @Post('send')
  @ApiBody({})
  async sendEmail(
    @Body('to') to: string[],
    @Body('subject') subject: string,
    @Body('body') body: string,
    @Body('attachments') attachments: { filename: string; path: string }[] = [],
  ) {
    await this.emailSenderService.sendEmail(to, subject, body, attachments);
    return 'Email sent successfully';
  }

  @Get('auth/oauth2callback')
  async handleOAuthCallback(@Query('code') code: string) {
    try {
      const oAuth2Client = await this.emailSenderService.getOAuth2Client();
    
      const { tokens } = await oAuth2Client.getToken(code);
      await this.emailSenderService.saveToken(tokens);
    
      return 'Authentication successful! You can now send emails.';
    } catch (error) {
      console.error('Error during OAuth callback:', error);
    
      if (error.response?.data?.error === 'invalid_grant') {
        return 'Authentication failed. Please regenerate the OAuth consent link and reauthenticate.';
      }
    
      return 'Authentication failed. Check server logs.';
    }
    
  }
}