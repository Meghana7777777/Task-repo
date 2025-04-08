import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { TeamCalenderDto } from "./team-calender.dto"

export class TeamCalenderResponse extends GlobalResponseObject{
    data?:TeamCalenderDto[]

    /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: TeamCalenderDto[]){
        super(status, errorCode, internalMessage);
        this.data = data;
     }

}