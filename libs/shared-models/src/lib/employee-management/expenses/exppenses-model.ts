export class ExpensesModelDto {
    expenses_id: number;
    DateTime: string;
    isActive: boolean;
    createdUser: string;
    updatedUser: string;
    versionFlag: number;
    expensesAganist: string;
    employeeName: string;
    branch: string;
    branchManager: string;
    expensesType: string;
    amount: number;
    paymentMode: string;
    referenceNo: string;
    paymentStatus: string;
    taxApplicable: string;
    approved: string;
    remarks: string;
    expenses_code: string

    constructor(
        expenses_id: number,
        DateTime: string,
        isActive: boolean,
        createdUser: string,
        updatedUser: string,
        versionFlag: number,
        expensesAganist: string,
        employeeName: string,
        branch: string,
        branchManager: string,
        expensesType: string,
        amount: number,
        paymentMode: string,
        referenceNo: string,
        paymentStatus: string,
        taxApplicable: string,
        approved: string,
        remarks: string,
        expenses_code: string
    ) {
        this.expenses_id = expenses_id;
        this.DateTime = DateTime;
        this.isActive = isActive;
        this.createdUser = createdUser;
        this.updatedUser = updatedUser;
        this.versionFlag = versionFlag;
        this.expensesAganist = expensesAganist;
        this.employeeName = employeeName;
        this.branch = branch;
        this.branchManager = branchManager;
        this.expensesType = expensesType;
        this.amount = amount;
        this.paymentMode = paymentMode;
        this.referenceNo = referenceNo;
        this.paymentStatus = paymentStatus;
        this.taxApplicable = taxApplicable;
        this.approved = approved;
        this.remarks = remarks;
        this.expenses_code = expenses_code;
    }
}
