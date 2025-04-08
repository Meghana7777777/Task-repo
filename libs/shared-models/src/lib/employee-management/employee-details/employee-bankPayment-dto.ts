export class BankPaySharedDto  {
    empCode: number;
    empName: string;
    mobNo: number;
    salary: number;
    bankName: string;
    bankAccNo: string;
    bankIfscNo: string;
    deptName: string

    constructor (
        empCode: number,
        empName: string,
        mobNo: number,
        salary: number,
        bankName: string,
        bankAccNo: string,
        bankIfscNo: string,
        deptName: string
    ) {
        this.empCode = empCode;
        this.empName =  empName;
        this.mobNo = mobNo;
        this.salary = salary;
        this.bankName = bankName;
        this.bankAccNo = bankAccNo;
        this.bankIfscNo= bankIfscNo;
        this.deptName = deptName
    }
}
