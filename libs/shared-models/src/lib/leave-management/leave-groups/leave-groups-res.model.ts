import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { LeaveGroupsDto } from "./leave-groups.dto";

export class LeaveGroupsResponseModel extends GlobalResponseObject {
    data? : LeaveGroupsDto[];
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: LeaveGroupsDto[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}