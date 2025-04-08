import { GetAllRolePermissionDropDownDto, GlobalResponseObject } from "@hrexpert/shared-models";


export class GetAllRolePermissionsDropDownResponse extends GlobalResponseObject {
    data?: GetAllRolePermissionDropDownDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: GetAllRolePermissionDropDownDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}