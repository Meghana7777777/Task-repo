import { DropdownOrganizationDto } from "@hrexpert/shared-models";
import { GlobalResponseObject } from "../ums-common";


export class DropdownOrganizationResponse extends GlobalResponseObject {
    data?: DropdownOrganizationDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?:  DropdownOrganizationDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}