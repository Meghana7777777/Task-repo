import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { RelationsDto } from "./relations.dto";


export class RelationResponseModel extends GlobalResponseObject {
    data? : RelationsDto[];
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: RelationsDto[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}