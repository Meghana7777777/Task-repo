import { GlobalResponseObject } from "./global-response-object";

export class CommonResponse extends GlobalResponseObject{
    data?: any;
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: any) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}
 