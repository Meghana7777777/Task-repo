import { GlobalResponseObject } from '../global-response-object';
import { AllUserRolePermissionsResponseDto } from './all-user-role-permissions.dto';

export class AllUserRolePermissionsResponse extends GlobalResponseObject {

    data?: AllUserRolePermissionsResponseDto[]

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: AllUserRolePermissionsResponseDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data
    }

}