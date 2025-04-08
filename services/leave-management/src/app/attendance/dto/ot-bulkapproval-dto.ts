import { ApiProperty } from "@nestjs/swagger"

export class OTBulkApprovalDto {
    @ApiProperty()
    departmentId: number
    @ApiProperty()
    date: any
    @ApiProperty()
    shiftId: number
    @ApiProperty()
    employeeId: number
    @ApiProperty()
    reason: Text
    @ApiProperty()
    finalOtHours: any
    @ApiProperty()
    editedFinalOtHours: string
    @ApiProperty()
    reportType: string
    @ApiProperty()
    branchId: number
    @ApiProperty()
    divisionId: number;
    @ApiProperty()
    attnFromDate: Date;
    @ApiProperty()
    attnToDate: Date;
    @ApiProperty()
    designationId: number;
    @ApiProperty()
    divisionName: string;
    @ApiProperty()
    branch_id: number;
    @ApiProperty()
    branches: string;
    @ApiProperty()
    shiftType: string;
    @ApiProperty()
    department: string;
    @ApiProperty()
    empCode: string;
    @ApiProperty()
    inTime: string;
    @ApiProperty()
    outTime: string;
    constructor(
        departmentId?: number,
        date?: any,
        shiftId?: number,
        employeeId?: number,
        reason?: Text,
        finalOtHours?: any,
        editedFinalOtHours?: string,
        reportType?: string,
        branchId?: number,
        divisionId?: number,
        attnFromDate?: Date,
        attnToDate?: Date,
        designationId?: number,
        divisionName?: string,
        branch_id?: number,
        branches?: string,
        shiftType?: string,
        department?: string,
        empCode?: string,
    ) {
        this.departmentId = departmentId
        this.date = date
        this.shiftId = shiftId
        this.employeeId = employeeId
        this.reason = reason
        this.finalOtHours = finalOtHours
        this.editedFinalOtHours = editedFinalOtHours
        this.reportType = reportType
        this.branchId = branchId
        this.divisionId = divisionId
        this.attnFromDate = attnFromDate
        this.attnToDate = attnToDate
        this.designationId = designationId
        this.divisionName = divisionName
        this.branch_id = branch_id
        this.branches = branches
        this.shiftType = shiftType
        this.department = department
        this.empCode = empCode

    }

}