import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { TypeOfLeavesDto } from "./types-of-leave.dto";

export class TypeOfLeavesResponseModel extends GlobalResponseObject {
    data? : TypeOfLeavesDto[];
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: TypeOfLeavesDto[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}