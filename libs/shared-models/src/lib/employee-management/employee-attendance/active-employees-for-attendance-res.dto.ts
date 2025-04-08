import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { ActiveEmployeesForAttendanceDto } from "./active-employees-for-attendance.dto";

export class ActiveEmployeesForAttendanceResponseModel extends GlobalResponseObject {
    data?: ActiveEmployeesForAttendanceDto[];
    /**
    * 
    * @param status 
    * @param errorCode 
    * @param internalMessage 
    * @param data 
    */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: ActiveEmployeesForAttendanceDto[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }
}