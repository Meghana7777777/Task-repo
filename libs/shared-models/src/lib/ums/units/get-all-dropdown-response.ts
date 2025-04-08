import { GlobalResponseObject } from "@hrexpert/backend-utils";
import { GetAllUnitDropDownDto } from "@hrexpert/shared-models";


export class GetAllUnitsDropDownResponse extends GlobalResponseObject {
    data?: GetAllUnitDropDownDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: GetAllUnitDropDownDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}