import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { ShiftDto } from "./shift.dto";

export class ShiftResponseModel extends GlobalResponseObject {
    data? : ShiftDto[];
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: ShiftDto[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}