import { GlobalResponseObject } from "@hrexpert/backend-utils";
import { ScopesDropDownDto } from "@hrexpert/shared-models";

export class GetAllScopesDropDownResponse extends GlobalResponseObject {
    data?: ScopesDropDownDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: ScopesDropDownDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}