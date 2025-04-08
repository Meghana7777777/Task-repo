
import { ApiProperty } from "@nestjs/swagger";

export class TypesOfLeavesDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  typeOfLeave: string;
  @ApiProperty()
  leaveCode: string;
  @ApiProperty()
  defaultLeaves:number;
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

