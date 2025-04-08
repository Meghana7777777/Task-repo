import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { WeekOffLeavesDto } from "./week-off-leaves.dto";


export class WeekOffLeavesResponseModel extends GlobalResponseObject {
    data? : WeekOffLeavesDto[];
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: WeekOffLeavesDto[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}