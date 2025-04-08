
import { GetAllAttributeDto } from "@hrexpert/shared-models";
import { GlobalResponseObject } from "../ums-common";


export class GetAllAttributesResponse extends GlobalResponseObject {
    data?: GetAllAttributeDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: GetAllAttributeDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}