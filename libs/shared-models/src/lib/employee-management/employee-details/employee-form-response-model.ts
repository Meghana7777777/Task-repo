import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { EmployeeDetailsDto } from "./employee-details.dto";

export class EmployeeFormResponseModel extends GlobalResponseObject {
    data?: EmployeeDetailsDto[];
    totalRecords?: number;
    /**
    * 
    * @param status 
    * @param errorCode 
    * @param internalMessage 
    * @param data 
    * @param totalRecords
    */

    constructor(status: boolean, errorCode: number, internalMessage: string, data?: EmployeeDetailsDto[], totalRecords?: number) {
        super(status, errorCode, internalMessage);
        this.data = data;
        this.totalRecords = totalRecords;
    }

}