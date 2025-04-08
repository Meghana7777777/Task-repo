import { ModuleDto } from "@hrexpert/shared-models";
import { GlobalResponseObject } from "../ums-common";



export class GetAllModulesResponse extends GlobalResponseObject {
    data?: ModuleDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: ModuleDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}