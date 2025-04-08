export class PayRollMisReportReq {
    payMonthStartDate?: any;
    payMonthEndDate?: any;
    employeeId?: number;
    name?: string;
    columnName?: string;
    branchId?: string;
    payrollMonth?: string;
    payrollYear?: string;
    payMode?: string;
    constructor(
        payMonthStartDate?: any,
        payMonthEndDate?: any,
        employeeId?: number,
        name?: string,
        columnName?: string,
        branchId?: string,
        payrollMonth?: string,
        payrollYear?: string,
        payMode?: string,
    ) {
        this.payMonthStartDate = payMonthStartDate;
        this.payMonthEndDate = payMonthEndDate;
        this.employeeId = employeeId;
        this.name = name;
        this.columnName = columnName;
        this.branchId = branchId;
        this.payrollMonth = payrollMonth;
        this.payrollYear = payrollYear;
        this.payMode = payMode;
    }
}