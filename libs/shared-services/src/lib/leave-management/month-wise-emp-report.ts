export class MonthWIseEmpReportReq {
    month?: any;
    year?:any;
    department?: string;
    division?: string;
    branch?: string;
    employeeId?:string
    attendanceMonth?: string;
    freezeStatus?: string;
    page?: number;
    pageSize?: number;
    empCodes?:string[];
    date?:string;
    status?:string;
    payDays?:number;
    allowanceDays?:number;
    isExcel?:boolean;
    attnFromDate?: string;
    attnToDate?: string;
    employeeTypeId?: number
}