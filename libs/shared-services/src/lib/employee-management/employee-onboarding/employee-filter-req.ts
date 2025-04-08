import { EmployeeStatus } from "@hrexpert/shared-models";

export class EmployeeFilterReq {
    employeeId?:number;
    department?: string; 
    designation?: string;
    page?: number;
    pageSize?: number;
    branchId?:any;
    employeeStatus?: EmployeeStatus.LessAgeLimit
    isExcel?: boolean;
    divisionName?:number;
    departmentId?:number;
    designationId?:number;
    search?: string;
    employeeCode?: string;
    searchEmpCode?: string;
    reportingManager?:number;
    employeeType?:number;
    activeInactive?:[]
    reportingManagerId?:any
}