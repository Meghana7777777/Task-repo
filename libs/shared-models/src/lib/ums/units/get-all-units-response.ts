import { GlobalResponseObject } from "../ums-common";
import { GetAllUnitDto } from "./unit.dto";

export class GetAllUnitsResponse extends GlobalResponseObject {
    data?: GetAllUnitDto[];
    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: GetAllUnitDto[]) {
        super(status, errorCode, internalMessage)
        this.data = data;
    }

}