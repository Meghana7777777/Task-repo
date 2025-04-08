
import { ApiProperty } from "@nestjs/swagger";

export class AttendanceStatusDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  branchId: number;
  @ApiProperty()
  branchName: number;
  @ApiProperty()
  attendanceStatus: string;
  @ApiProperty()
  startTime: string;
  @ApiProperty()
  endTime: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdUser: string;
  @ApiProperty()
  updatedUser: string;
  @ApiProperty()
  versionFlag: number;
  @ApiProperty()
  companyCode: string; // Add this if not present
}

