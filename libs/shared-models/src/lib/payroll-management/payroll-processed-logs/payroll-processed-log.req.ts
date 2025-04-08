
export class PayrollProcessedLogReq {
    id?: number;
    employeeId?: number;
    employeeCode?: number;
    payPeriod?: any;
    payDays?: any;
    payrollWeek?: string;
    payrollMonth?: number;
    empId?: number[]
    page?: number;
    pageSize?: number;
    offset?: number;
    limit?: number;
    branchId: number;
    departmentId: number;
    designationId: number;
    divisionId: [];
    employeeTypeId?: number
    isActive?: number;
    status?: string;
    constructor(
        id?: number,
        employeeId?: number,
        employeeCode?: number,
        payPeriod?: any,
        payDays?: any,
        payrollWeek?: string,
        payrollMonth?: number,
        empId?: number[],
        page?: number,
        pageSize?: number,
        offset?: number,
        limit?: number,
        branchId?: number,
        departmentId?: number,
        designationId?: number,
        divisionId?: [],
        employeeTypeId?: number,
        isActive?: number,
        status?: string,
    ) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.payPeriod = payPeriod;
        this.payDays = payDays;
        this.payrollWeek = payrollWeek;
        this.payrollMonth = payrollMonth;
        this.branchId = branchId;
        this.empId = empId
        this.page = page;
        this.pageSize = pageSize;
        this.offset = offset;
        this.limit = limit;
        this.branchId = branchId;
        this.departmentId = departmentId;
        this.designationId = designationId;
        this.divisionId = divisionId;
        this.employeeTypeId = employeeTypeId;
        this.isActive = isActive
        this.status = status
    }
}