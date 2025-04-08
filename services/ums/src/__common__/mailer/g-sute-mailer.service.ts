import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { SendOptions } from './dtos/send-mail.dto';
import { ErrorResponse } from '@hrexpert/backend-utils';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';



@Injectable()
export class GSuiteMailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'alerts@schemaxtech.com',
        pass: 'jtix zvsf lcor mamp',
      },
    });
  }

  async sendGSuiteMail(req: SendOptions, maxRetries: number = 3) {
    console.log
    let retries = 0;
    while (retries < maxRetries) {
      try {
        await this.transporter.sendMail(req);
        return new CommonResponse(true, 1111, 'Mail sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
        if (
          error.code === 'EENVELOPE' ||
          error.code === 'ECONNECTION' ||
          error.code === 'EMESSAGE'
        ) {
          throw new ErrorResponse(
            500,
            'Failed to send mail: Invalid email configuration'
          );
        } else if (error.code === 'EPROTOCOL' || error.code === 'EAUTH') {
          throw new ErrorResponse(
            500,
            'Failed to send mail: Authentication or protocol error'
          );
        } else {
          console.error(`Error sending email. Retrying...`);
          retries++;
          const delay = Math.pow(2, retries - 1) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new ErrorResponse(
      500,
      'Failed to send mail: Unknown error'
    );
  }


}
