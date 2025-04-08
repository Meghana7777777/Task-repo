

import { GlobalResponseObject } from "@hrexpert/backend-utils";
import { ApplyForLeaveDto, } from "./apply-for-leave-dto";
import { ApplyForLeavesDtos } from "./manual-leave.dto";


export class ApplyForLeaveResponseModel extends GlobalResponseObject{
    data?: ApplyForLeaveDto[];

    /**
     * 
     * @param status
     * @param intlCode
     * @param internalMessage
     * @param data
     */

    constructor(status: boolean, intlCode: number, internalMessage: string, data?: ApplyForLeaveDto[]){
        super(status, intlCode, internalMessage);
        this.status = status;
        
        this.internalMessage = internalMessage;
        this.data = data;
    }
}




export class ApplyForLeaveResponseModels extends GlobalResponseObject{
    data?: ApplyForLeavesDtos;

    /**
     * 
     * @param status
     * @param intlCode
     * @param internalMessage
     * @param data
     */

    constructor(status: boolean, intlCode: number, internalMessage: string, data?:  ApplyForLeavesDtos){
        super(status, intlCode, internalMessage);
        this.status = status;
       
        this.internalMessage = internalMessage;
        this.data = data;
    }
}