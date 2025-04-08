
export class EmployeeIdProofsDto {
    id: number;
    employeeId: number;
    idType: number;
    idNumber: string;
    file?: string

    constructor(
        id: number,
        employeeId: number,
        idType: number,
        idNumber: string,
        file?: string

    ) {
        this.id = id
        this.employeeId = employeeId
        this.idType = idType
        this.idNumber = idNumber
        this.file = file

    }
}