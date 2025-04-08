import { ModulesDropDownDto } from "@hrexpert/shared-models";
import { GlobalResponseObject } from "../ums-common";
 



export class GetAllModulesDropDownResponse extends GlobalResponseObject {
    data?: ModulesDropDownDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: ModulesDropDownDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}