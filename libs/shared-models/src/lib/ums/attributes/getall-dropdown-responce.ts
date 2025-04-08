import { GetAllAttributeDropDown } from "@hrexpert/shared-models";
import { GlobalResponseObject } from "../ums-common";
 


export class GetAllAttributesDropDownResponse extends GlobalResponseObject {
    data?: GetAllAttributeDropDown[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: GetAllAttributeDropDown[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}