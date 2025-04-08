import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { AttendanceStatusDto } from "./attendance-status.dto";

export class AttendanceStatusResponseModel extends GlobalResponseObject {
    data? : AttendanceStatusDto[];
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: AttendanceStatusDto[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}