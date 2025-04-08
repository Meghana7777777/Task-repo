export class EmpAsssetMappingModel {
    employeeAssetId: number;
    employeeId: number;
    assetId: string[];
    issuedDate: Date;
    branch: string;
    returnDate: Date;
    assetStatus: string;
    remarks: string;
    isActive: boolean;
    constructor(
        employeeAssetId: number,
        employeeId: number,
        assetId: string[],
        issuedDate: Date,
        returnDate: Date,
        branch: string,
        assetStatus: string,
        remarks: string,
        isActive: boolean,
    ) {
        this.employeeAssetId = employeeAssetId;
        this.employeeId = employeeId;
        this.assetId = assetId;
        this.issuedDate = issuedDate;
        this.returnDate = returnDate;
        this.branch = branch;
        this.assetStatus = assetStatus;
        this.remarks = remarks;
        this.isActive = isActive;
    }
}
