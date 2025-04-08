import { GlobalResponseObject } from '../global-response-object';
import { RolesCreateDto } from './roles.dto';
export class RolesTypeResponse extends GlobalResponseObject {
    data?: RolesCreateDto;

    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */
    constructor(status: boolean, errorCode: number, internalMessage: string, data?: RolesCreateDto) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}