import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { DesignationsReq } from "./designations-req.dto";

export class DesignationsResponseModel extends GlobalResponseObject {
    data? : DesignationsReq[];
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: DesignationsReq[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}