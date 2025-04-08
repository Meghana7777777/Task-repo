import { ApiProperty } from "@nestjs/swagger"

export class LeaveHistoryDto{

    @ApiProperty()
    id: number;

    @ApiProperty()
    employeeId: number;

    @ApiProperty()
    leaveTypeId: number;

    @ApiProperty()
    year: string;

    @ApiProperty()
    leavesAllotted: number;

    @ApiProperty()
    leavesUsed: number;

    @ApiProperty()
    available: number;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    versionFlag: number;

    @ApiProperty()
    companyCode: string;

  }

  export class EmployeeReq{
    @ApiProperty()
    employeeId: number
  
    @ApiProperty()
    departmentId: number
  }