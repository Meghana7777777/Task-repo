import { GlobalResponseObject } from "../../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { EmployeeViewModel } from "./employee-view.model";

export class EmployeeViewResponseModel extends GlobalResponseObject {
    data? : EmployeeViewModel[];
    totalCount? : number;
    totalActive?:any;
    totalInactive?:any;
    employeeData?:any
    employeesTypeCount?:any
    workersTypeCount?:any
     /**
     * 
     * @param status 
     * @param errorCode 
     * @param internalMessage 
     * @param data 
     * @param totalCount
     */

     constructor(status: boolean, errorCode: number, internalMessage: string, data?: EmployeeViewModel[], totalCount?:number,totalActive?:number,totalInactive?:number,employeeData?:any,
      employeesTypeCount?:any,
      workersTypeCount?:any
     ){
        super(status, errorCode, internalMessage);
        this.data = data;
        this.totalCount = totalCount;
        this.totalActive = totalActive;
        this.totalInactive = totalInactive;
        this.employeeData = employeeData;
        this.employeesTypeCount = employeesTypeCount;
        this.workersTypeCount = workersTypeCount;
     }

}