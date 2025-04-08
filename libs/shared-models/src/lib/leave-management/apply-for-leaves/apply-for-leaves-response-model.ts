import { ApplyForLeavesReqModel, GlobalResponseObject } from "@hrexpert/shared-models";

export class ApplyForLeavesResponseModel extends GlobalResponseObject{
    data?: ApplyForLeavesReqModel[];

    /**
     * 
     * @param status
     * @param internalMessage
     * @param data
     */

    constructor(status: boolean, intlCode: number, internalMessage: string, data?: ApplyForLeavesReqModel[]){
        super(status, intlCode, internalMessage);
        this.status = status;
        this.internalMessage = internalMessage;
        this.data = data;
    }
}




export class ApplyForLeavesResponseModels extends GlobalResponseObject{
    data?: ApplyForLeavesReqModel[];

    /**
     * 
     * @param status
     * @param internalMessage
     * @param data
     */

    constructor(status: boolean, intlCode: number, internalMessage: string, data?: ApplyForLeavesReqModel[]){
        super(status, intlCode, internalMessage);
        this.status = status;
        this.internalMessage = internalMessage;
        this.data = data;
    }
}