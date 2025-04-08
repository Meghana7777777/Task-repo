import { GlobalResponseObject } from '../global-response-object';
import { UserRolesDto } from './user-role-query.dto';

export class AllUserRolesResponse extends GlobalResponseObject {

    data?: UserRolesDto[]

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: UserRolesDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data
    }

}