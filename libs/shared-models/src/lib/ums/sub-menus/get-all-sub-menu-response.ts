import { GlobalResponseObject } from "@hrexpert/backend-utils";
import { SubMenuDto } from "@hrexpert/shared-models";


export class GetAllSubMenusResponse extends GlobalResponseObject {
    data?: SubMenuDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: SubMenuDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}