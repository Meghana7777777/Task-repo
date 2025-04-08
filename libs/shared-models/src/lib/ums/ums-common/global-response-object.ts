

export class GlobalResponseObject {
    status: boolean;
    errorCode: number;
    internalMessage: string;
    /**
     *
     * @param status
     * @param errorCode
     * @param internalMessage
     */
    constructor(status: boolean, errorCode: number, internalMessage: string){
        this.status = status;
        this.errorCode = errorCode;
        this.internalMessage = internalMessage;
    }
}

