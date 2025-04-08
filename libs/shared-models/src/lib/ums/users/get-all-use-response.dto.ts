
import { GetAllUserDto, GlobalResponseObject } from "@hrexpert/shared-models";


export class GetAllUsersResponse extends GlobalResponseObject {


    data?: GetAllUserDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: GetAllUserDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}
