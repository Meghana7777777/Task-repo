import { GlobalResponseObject } from "@hrexpert/backend-utils";
import { PermissionsDto } from "@hrexpert/shared-models";

export class GetAllPermissionResponse extends GlobalResponseObject{
    data?: PermissionsDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: PermissionsDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}