
import { ApiProperty } from "@nestjs/swagger";

export class ShiftDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  // branchId: number;
  @ApiProperty()
  branchName: number;
  @ApiProperty()
  shiftType: string;
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

