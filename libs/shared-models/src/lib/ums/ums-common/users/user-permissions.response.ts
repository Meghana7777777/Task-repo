import { GlobalResponseObject } from '../global-response-object';
import { UserPermissionsDto } from './user-permissions.dto';

export class UserPermissionsResponse extends GlobalResponseObject {

    data?: UserPermissionsDto

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: UserPermissionsDto) {
        super(status, errorCode, internalMessage)
        this.data = data
    }

}