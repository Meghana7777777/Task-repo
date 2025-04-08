import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { DivisionDto } from "./division.dto";



export class DivisionResponseModel extends GlobalResponseObject {
    data? : DivisionDto[];
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: DivisionDto[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}