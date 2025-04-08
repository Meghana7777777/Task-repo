
import { ApiProperty } from "@nestjs/swagger";

export class BranchDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  branchName: string;
  @ApiProperty()
  address: string;
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
  branchCode: string;
  @ApiProperty()
  isEmployee: number;
  @ApiProperty()
  isWorker: number;
  @ApiProperty()
  ptApplicable: string;
  @ApiProperty()
  companyName: string;
  @ApiProperty()
  companyId: any;
  @ApiProperty()
  unitName: string;
  @ApiProperty()
  state: string;
}

