


export class MessageRequest {
    recipient: string;
    message: string;
    greeting: string;
    senderName: string;
    senderEmail?: string;
    
    constructor(recipient: string,greeting: string, message: string, senderName: string,  senderEmail?: string) {
        this.recipient = recipient;
        this.greeting = greeting;
        this.message = message;
        this.senderName = senderName;
       
        this.senderEmail = senderEmail;
    }
}