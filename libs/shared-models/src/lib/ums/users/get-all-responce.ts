
import { GetAllUsersDto, GlobalResponseObject } from "@hrexpert/shared-models";


export class GetAllUserResponse extends GlobalResponseObject {


    data?: GetAllUsersDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: GetAllUsersDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}
