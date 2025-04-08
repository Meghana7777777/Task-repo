import { Module } from '@nestjs/common';
import { GSuiteMailerService } from './g-sute-mailer.service';
import { MailerController } from './mailer.controller';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  controllers: [MailerController],
  providers: [GSuiteMailerService,ApplicationExceptionHandler],
  exports:[GSuiteMailerService]
})
export class MailerModule {}
