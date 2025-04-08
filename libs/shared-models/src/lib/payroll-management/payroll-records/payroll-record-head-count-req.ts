export class PayRollComparisontReq {
    payMonthStartDate?: any;
    payMonthEndDate?: any;
    employeeId?: number;
    name?: string;
    columnName?: string;
    branchId?: string;
    payrollMonth?: string;
    constructor(
        payMonthStartDate?: any,
        payMonthEndDate?: any,
        employeeId?: number,
        name?: string,
        columnName?: string,
        branchId?: string,
        payrollMonth?: string,
    ) {
        this.payMonthStartDate = payMonthStartDate;
        this.payMonthEndDate = payMonthEndDate;
        this.employeeId = employeeId;
        this.name = name;
        this.columnName = columnName;
        this.branchId = branchId;
        this.payrollMonth = payrollMonth;
    }
}