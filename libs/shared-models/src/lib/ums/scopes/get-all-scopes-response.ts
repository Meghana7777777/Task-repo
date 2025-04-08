import { GlobalResponseObject } from "@hrexpert/backend-utils";
import { GetAllScopesDto } from "@hrexpert/shared-models";


export class GetAllScopesResponse extends GlobalResponseObject {
    data?: GetAllScopesDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: GetAllScopesDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}