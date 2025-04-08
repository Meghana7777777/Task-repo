import { GlobalResponseObject } from "@hrexpert/backend-utils";
import { UserRoleDto } from "@hrexpert/shared-models";



export class UserRolesResponse extends GlobalResponseObject {
    data?: UserRoleDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: UserRoleDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}