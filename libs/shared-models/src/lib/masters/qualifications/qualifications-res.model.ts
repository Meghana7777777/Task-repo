import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { QualificationsReq } from "./qualifications-req.dto";

export class QualificationsResponseModel extends GlobalResponseObject {
    data? : QualificationsReq[];
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: QualificationsReq[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}