import { ClientAppsDto, GlobalResponseObject } from "@hrexpert/shared-models";

 




export class ClientAppsResponse extends GlobalResponseObject {
    data?: ClientAppsDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: ClientAppsDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}