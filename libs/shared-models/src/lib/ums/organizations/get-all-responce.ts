import { GetAllOrganizations } from "@hrexpert/shared-models";
import { GlobalResponseObject } from "../ums-common";


export class GetAllOrganizationResponse extends GlobalResponseObject {
    data?: GetAllOrganizations[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?:  GetAllOrganizations[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}