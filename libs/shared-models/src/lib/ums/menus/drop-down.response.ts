import { MenusDropdownDto } from "@hrexpert/shared-models";
import { GlobalResponseObject } from "../ums-common";





export class MenusDropDownResponse extends GlobalResponseObject{
    data?: MenusDropdownDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: MenusDropdownDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }
}