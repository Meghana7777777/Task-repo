import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { BranchesDto } from "./branches.dto";

export class BranchResponseModel extends GlobalResponseObject {
    data? : BranchesDto[];
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: BranchesDto[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}