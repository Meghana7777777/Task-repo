import { GlobalResponseObject } from "@hrexpert/backend-utils";
import { GetAllRolesDropDown } from "@hrexpert/shared-models";



export class GetAllRolesDropDownResponse extends GlobalResponseObject {
    data?: GetAllRolesDropDown[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: GetAllRolesDropDown[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}