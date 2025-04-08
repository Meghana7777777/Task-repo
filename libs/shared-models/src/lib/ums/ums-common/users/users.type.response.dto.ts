import { GlobalResponseObject } from '../global-response-object';
import { UsersCreateDto } from './users.dto';
export class UsersTypeResponse extends GlobalResponseObject {
    data?: UsersCreateDto;

    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */
    constructor(status:boolean, errorCode:number, internalMessage:string, data?: UsersCreateDto){
        super(status,errorCode,internalMessage);
        this.data = data;
    }
}