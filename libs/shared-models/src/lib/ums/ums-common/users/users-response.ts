import { GlobalResponseObject } from '../global-response-object';
import { UsersResponseDto } from './users-getdata-response.dto';

export class UsersResponse extends GlobalResponseObject {

    data?: UsersResponseDto[]

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: UsersResponseDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data
    }

}