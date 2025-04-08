export class EmpNonRecComponentsReq {
    id: number;
    employeeId: number;
    componentId: number;
    amount: number;
    totalAmount: number;
    fromDate: string;
    isPermanent?: boolean
    termCount: number;
    totalTerms: string;
    isActive: boolean;
    createdUser: string;
    updatedUser: string;
    versionFlag: number;
    constructor(
        id: number,
        employeeId: number,
        componentId: number,
        amount: number,
        totalAmount: number,
        fromDate: string,
        isPermanent?: boolean,
        termCount?: number,
        totalTerms?: string,
        isActive?: boolean,
        createdUser?: string,
        updatedUser?: string,
        versionFlag?: number,
    ) {
        this.id = id
        this.employeeId = employeeId
        this.componentId = componentId
        this.amount = amount
        this.totalAmount = totalAmount
        this.fromDate = fromDate
        this.isPermanent = isPermanent
        this.termCount = termCount
        this.totalTerms = totalTerms
        this.isActive = isActive
        this.createdUser = createdUser
        this.updatedUser = updatedUser
        this.versionFlag = versionFlag
    }

}



