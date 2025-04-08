import { Injectable } from '@nestjs/common';
// import { google, gmail_v1 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { google } from 'googleapis';
import axios from 'axios';

@Injectable()
export class EmailSenderService {
  private SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
  private CREDENTIALS_PATH = 'services/payroll-management/src/app/email-sender/credentials.json';
  private TOKEN_PATH = path.join(process.cwd(), 'token.json');

  async getOAuth2Client() {
    const credentials = JSON.parse(
      fs.readFileSync(this.CREDENTIALS_PATH, 'utf-8'),
    );
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const redirectUri = redirect_uris[0];
  
    const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);
  
    if (fs.existsSync(this.TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(this.TOKEN_PATH, 'utf-8'));
      oauth2Client.setCredentials(token);
  
      // Check if token is expired and refresh it
      const tokenInfo = await oauth2Client.getAccessToken();
      const expiryDate = tokenInfo.res?.data.expiry_date;
      if (expiryDate && expiryDate <= Date.now()) {
        const refreshedToken = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(refreshedToken.credentials);
        await this.saveToken(refreshedToken.credentials);
      }
    } else {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: this.SCOPES,
      });
      console.log('Authorize this app by visiting this URL:', authUrl);
    }
  
    return oauth2Client;
  }  

  async saveToken(tokens: any) {
    fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token stored to', this.TOKEN_PATH);
  }

  private createMessage(
    to: string[],
    subject: string,
    body: string,
    attachments: { filename: string; content: Buffer }[] = [],
  ): string {
    const boundary = 'boundary-string';
    const emailLines = [];

    emailLines.push(`To: ${to.join(', ')}`);
    emailLines.push(`Subject: ${subject}`);
    emailLines.push(`Content-Type: multipart/mixed; boundary=${boundary}`);
    emailLines.push('');
    emailLines.push(`--${boundary}`);
    emailLines.push(`Content-Type: text/html; charset=UTF-8`);
    emailLines.push('');
    emailLines.push(body);

    for (const attachment of attachments) {
      emailLines.push('');
      emailLines.push(`--${boundary}`);
      emailLines.push(`Content-Type: application/octet-stream; name=${attachment.filename}`);
      emailLines.push(`Content-Disposition: attachment; filename=${attachment.filename}`);
      emailLines.push(`Content-Transfer-Encoding: base64`);
      emailLines.push('');
      emailLines.push(attachment.content.toString('base64'));
    }

    emailLines.push('');
    emailLines.push(`--${boundary}--`);

    return Buffer.from(emailLines.join('\r\n'))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  async sendEmail(
    to: string[],
    subject: string,
    body: string,
    attachments: { filename: string; path: string }[] = [],
  ) {
    const auth = await this.getOAuth2Client();
    const gmail = google.gmail({ version: 'v1', auth });

    const attachmentBuffers = await Promise.all(
      attachments.map(async (file) => {
        if (file.path.startsWith('http')) {
          // Handle URL-based files
          const response = await axios.get(file.path, { responseType: 'arraybuffer' });
          return {
            filename: file.filename,
            content: Buffer.from(response.data),
          };
        } else {
          // Handle local files
          return {
            filename: file.filename,
            content: fs.readFileSync(file.path),
          };
        }
      }),
    );

    const rawMessage = this.createMessage(to, subject, body, attachmentBuffers);

    try {
      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: rawMessage,
        },
      });
      console.log('Email sent successfully:', result.data);
    } catch (error) {
      if (error.response) {
        console.error('Gmail API error:', error.response.data);
      } else {
        console.error('Unexpected error:', error.message);
      }
      throw new Error('Failed to send email');
    }    
  }
}