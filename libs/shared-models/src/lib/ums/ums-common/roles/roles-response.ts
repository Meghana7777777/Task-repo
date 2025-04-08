import { GlobalResponseObject } from '../global-response-object';
import { RolesResponseDto } from './roles-getdata.response.dto';

export class RolesResponse extends GlobalResponseObject {

    data?: RolesResponseDto[]

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: RolesResponseDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data
    }

}