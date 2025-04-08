export class EmailRequest {
    to: string[];
    subject: string;
    body: string;
    attachments?: {
        filename: string;
        path: string;
    }[];
}
