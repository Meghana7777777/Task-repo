import { DropdownModel } from "./dropdown.model";
import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
export class DropdownResponseModel extends GlobalResponseObject {
    data? : DropdownModel[];
    /**
    * 
    * @param status 
    * @param errorCode 
    * @param internalMessage 
    * @param data 
    */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: DropdownModel[]){
       super(status, errorCode, internalMessage);
       this.data = data;
    }
}