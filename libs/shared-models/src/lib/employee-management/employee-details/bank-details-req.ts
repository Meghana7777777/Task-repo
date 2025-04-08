
export class BankDetailsReq {
    id?: number;
    employeeCode?: string
    pfNo?: string;
    esicNo?: string;
    isPfEligible?: string;
    isEsicEligible?: string;
    bankName?: string;
    bankAcNo?: string;
    bankIfscCode?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    createdUser?: string;
    updatedUser?: string;
    constructor(
        id?: number,
        employeeCode?: string,
        pfNo?: string,
        esicNo?: string,
        isPfEligible?: string,
        isEsicEligible?: string,
        bankName?: string,
        bankAcNo?: string,
        bankIfscCode?: string,
        isActive?: boolean,
        createdAt?: Date,
        updatedAt?: Date,
        createdUser?: string,
        updatedUser?: string,
    ) {
        this.id = id
        this.employeeCode = employeeCode
        this.pfNo = pfNo
        this.esicNo = esicNo
        this.isPfEligible = isPfEligible
        this.isEsicEligible = isEsicEligible
        this.bankName = bankName
        this.bankAcNo = bankAcNo
        this.bankIfscCode = bankIfscCode
        this.isActive = isActive
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.createdUser = createdUser
        this.updatedUser = updatedUser
    }


}