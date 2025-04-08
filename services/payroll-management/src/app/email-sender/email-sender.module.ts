import { Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { EmailSenderController } from './email-sender.controller';

@Module({
  controllers: [EmailSenderController],
  providers: [EmailSenderService],
  // exports: [EmailSenderService],
})
export class GmailModule {}
