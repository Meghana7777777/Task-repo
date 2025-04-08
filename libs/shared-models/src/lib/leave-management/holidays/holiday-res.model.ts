import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { HolidayDto } from "./holiday.dto";

export class HolidayResponseModel extends GlobalResponseObject {
    data? : HolidayDto[];
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: HolidayDto[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}