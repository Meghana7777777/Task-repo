import { GlobalResponseObject } from "@hrexpert/backend-utils";
import { GetAllRolesDto } from "@hrexpert/shared-models";



export class GetAllRolesResponse extends GlobalResponseObject {
    data?: GetAllRolesDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: GetAllRolesDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}