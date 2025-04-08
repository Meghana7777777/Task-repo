import { ApplicationsDropDownDto } from "@hrexpert/shared-models";
import { GlobalResponseObject } from "../ums-common";
 



export class ApplicationsDropDownResponse extends GlobalResponseObject {
    data?: ApplicationsDropDownDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: ApplicationsDropDownDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}