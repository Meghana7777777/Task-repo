import { ApiProperty } from "@nestjs/swagger";

export class PayrollProcessedLogDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    employeeId: number;

    @ApiProperty()
    employeeCode: number;

    @ApiProperty()
    payPeriod: Date;

    @ApiProperty()
    payDays: any;

    @ApiProperty()
    payrollWeek: string;

    @ApiProperty()
    payrollMonth: any;

    @ApiProperty()
    presentCount: number;

    @ApiProperty()
    absentCount: number;

    @ApiProperty()
    leaveCount: number;

    @ApiProperty()
    componentRecords: object;

    @ApiProperty()
    createdAt: string;

    @ApiProperty({ nullable: true })
    createdUser: string | null;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty({ nullable: true })
    updatedUser: string | null;

    @ApiProperty()
    versionFlag: number;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    departmentId: number;

    @ApiProperty()
    designationId: number;

    @ApiProperty()
    divisionId: number;

    @ApiProperty()
    employeeTypeId: number;

    page?: number;
    pageSize?: number;
    offset?: number;
    limit?: number;

    @ApiProperty()
    status: string;

}