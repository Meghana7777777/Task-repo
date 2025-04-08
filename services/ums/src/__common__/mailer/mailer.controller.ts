
import { Body, Controller, Post } from '@nestjs/common';
import { SendOptions } from './dtos/send-mail.dto';
import { GSuiteMailerService } from './g-sute-mailer.service';
import { ApplicationExceptionHandler, GlobalResponseObject } from '@hrexpert/backend-utils';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@Controller('mailer')
export class MailerController {
    constructor(private readonly service: GSuiteMailerService,
         private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('sendGSuiteMail')
    async sendGSuiteMail(@Body() req: SendOptions): Promise<CommonResponse> {
        try {
            return await this.service.sendGSuiteMail(req);
        } catch (error) {
            console.log(error)
            return this.applicationExceptionHandler.returnException(GlobalResponseObject, error);
        }
    }
}
