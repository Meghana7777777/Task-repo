export class EmpNonRecurringReq {
    id?: number;
    payRollEmployee: number;
    payRollComponent: number;
    totalAmount: number;
    emiCount: number;
    emiAmount: number;
    startDate: string;
    endDate: string;
    isActive?: boolean;
    createdUser?: string;
    updatedUser?: string;
    versionFlag?: number;
    tourPermissionAmount?: number;
    constructor(
        totalAmount: number,
        payRollEmployee: number,
        payRollComponent: number,
        emiCount: number,
        emiAmount: number,
        startDate: string,
        endDate: string,
        id?: number,
        isActive?: boolean,
        createdUser?: string,
        updatedUser?: string,
        versionFlag?: number,
        tourPermissionAmount?: number,
    ) {
        this.id = id;
        this.payRollEmployee = payRollEmployee
        this.payRollComponent = payRollComponent
        this.totalAmount = totalAmount
        this.emiAmount = emiAmount
        this.emiCount = emiCount
        this.startDate = startDate
        this.endDate = endDate
        this.isActive = isActive
        this.createdUser = createdUser
        this.updatedUser = updatedUser
        this.versionFlag = versionFlag
        this.tourPermissionAmount = tourPermissionAmount
    }

}


export class EmpNonRecurringUpdateReq {
    id: number;
    remainingAmount: number;
    emiCount: number;
    emiAmount: number;
    currentDate: string;
    endDate: string;
    payRollEmployee: number;
    payRollComponent: number;
    createdUser?: string;
    updatedUser?: string;
    

    constructor(
        id: number,
        remainingAmount: number,
        emiCount: number,
        emiAmount: number,
        currentDate: string,
        endDate: string,
        payRollEmployee: number,
        payRollComponent: number,
        createdUser?: string,
        updatedUser?: string,

    ) {
        this.id = id;
        this.currentDate = currentDate
        this.emiAmount = emiAmount
        this.emiCount = emiCount
        this.remainingAmount = remainingAmount
        this.endDate = endDate
        this.payRollEmployee = payRollEmployee
        this.payRollComponent = payRollComponent
        this.createdUser = createdUser
        this.updatedUser = updatedUser

    }

}



