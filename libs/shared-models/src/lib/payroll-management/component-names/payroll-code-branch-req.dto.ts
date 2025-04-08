
export class PayrollCodeBranchMappingReq {
    id: number;
    pyarollCode: string;
    branchId: number;
    employeeTypeId: number;
    createdUser: string;
    isActive?: boolean
    versionFlag?: number;
    updatedUser?: string;
    updatedAt?: Date;

    constructor(id: number, pyarollCode: string, branchId: number,employeeTypeId: number,
        createdUser: string, isActive?: boolean, versionFlag?: number, updatedUser?: string,
        updatedAt?: Date) {
        this.id = id;
        this.pyarollCode = pyarollCode;
        this.branchId = branchId;
        this.employeeTypeId = employeeTypeId;
        this.createdUser = createdUser;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.updatedUser = updatedUser;
        this.updatedAt = updatedAt;

    }
}
