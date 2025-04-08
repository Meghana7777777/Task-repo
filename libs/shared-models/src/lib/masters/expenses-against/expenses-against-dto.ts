export class EmployeeAgainstDto {
    expenseAgainstId: number;
    expenseAgainst: string;
    isActive: boolean;
    constructor(
        expenseAgainstId: number,
        expenseAgainst: string,
        isActive: boolean,
    ) {
        this.expenseAgainstId = expenseAgainstId
        this.expenseAgainst = expenseAgainst
        this.isActive = isActive
    }
}

