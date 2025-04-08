

export class MessageResponse {
    status: boolean;
    internalMessage: string;

    /**
     * 
     * @param status 
     * @param internalMessage 
     */
    constructor(status: boolean, internalMessage: string) {
        this.status = status;
        this.internalMessage = internalMessage;
    }
}