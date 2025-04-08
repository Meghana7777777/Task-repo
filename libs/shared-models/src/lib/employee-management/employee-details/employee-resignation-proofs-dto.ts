export class EmpResignationProofsDto {
    id: number;
    employeeId: number;
    employeeCode: string;
    firstName: string;
    dateOfReliving: string;
    employeeRemarks: any
    fileName?: string;
    originalFileName?: string;
    filePath?: string;
   
    constructor(
        id: number,
        employeeId: number,
        employeeCode: string,
        firstName: string,
        dateOfReliving: string,
        employeeRemarks: any,
        fileName?: string,
        originalFileName?: string,
        filePath?: string,
    ) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.firstName = firstName;
        this.dateOfReliving = dateOfReliving;
        this.employeeRemarks=employeeRemarks
        this.fileName = fileName;
        this.originalFileName = originalFileName;
        this.filePath = filePath;
    }

}