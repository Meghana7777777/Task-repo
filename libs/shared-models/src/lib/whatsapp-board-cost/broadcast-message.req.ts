export class BroadCastMessageRequest{
    messageCode:number;
    message?: string;
    receivers?: string[];

    constructor(messageCode:number,
        message?: string,
        receivers?: string[]
    ){
            this.messageCode = messageCode
            this.message = message
            this.receivers = receivers

    }
}