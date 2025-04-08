import { GlobalResponseObject } from '../global-response-object';
import { AllUserPermissionsResponseDto } from './all-user-permissions.dto';

export class AllUserPermissionsResponse extends GlobalResponseObject {

    data?: AllUserPermissionsResponseDto[]

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: AllUserPermissionsResponseDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data
    }

}