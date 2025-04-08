
import { ApiProperty } from "@nestjs/swagger";
import { LeaveAllocationLogDto } from "./leave-allocation-log-dto";

export class LeaveAllocationsDto {
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
  @ApiProperty()
  unitCode: string;
  @ApiProperty()
  logs: LeaveAllocationLogDto[]

  @ApiProperty()
  date: Date
}

export class EmpDataReq{
  @ApiProperty()
  employeeId: number

  @ApiProperty()
  departmentId: number

  @ApiProperty()
  designationId: number
  
  @ApiProperty()
  divisionId: number

  @ApiProperty()
  monthYear?: any;
}

