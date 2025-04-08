import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LeaveAllocationLogDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  employeeId: number;

  @ApiProperty()
  @IsInt()
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
  companyCode: string | null;

  @ApiProperty()
  unitCode: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdUser: string | null;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedUser: string | null;

  @ApiProperty()
  versionFlag: number;

}
