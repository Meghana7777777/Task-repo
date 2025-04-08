
export class BranchesDto {
    id: number;
    branchName: string;
    branchCode: string;
    address: string;
    ptApplicable: string;
    state: string
    createdUser: string;
    isActive?: boolean
    versionFlag?: number;
    updatedUser?: string;
    updatedAt?: Date;
    companyName?: any;
    companyId?: any;

    constructor(id?: number, branchName?: string, branchCode?: string,
        address?: string, ptApplicable?: string, state?: string,
        createdUser?: string, isActive?: boolean, versionFlag?: number, updatedUser?: string,
        updatedAt?: Date,companyName?:any,companyId?:any) {
        this.id = id;
        this.address = address;
        this.branchName = branchName;
        this.branchCode = branchCode;
        this.createdUser = createdUser;
        this.ptApplicable = ptApplicable
        this.state = state
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.updatedUser = updatedUser;
        this.updatedAt = updatedAt;
        this.companyName = companyName;
        this.companyId = companyId;

    }
}
