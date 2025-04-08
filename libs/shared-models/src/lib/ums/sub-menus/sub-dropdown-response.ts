import { GlobalResponseObject, SubMenuDropDownDto } from "@hrexpert/shared-models";


export class SubMenusDropDownResponse extends GlobalResponseObject {
    data?: SubMenuDropDownDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: SubMenuDropDownDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}