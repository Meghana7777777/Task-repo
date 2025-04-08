
import { ApiProperty } from "@nestjs/swagger";

export class PayrollCodeBranchMappingDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  payrollCode: string;
  @ApiProperty()
  branchId: number;
  @ApiProperty()
  employeeTypeId: number;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdUser: string;
  @ApiProperty()
  updatedUser: string;
  @ApiProperty()
  versionFlag: number;
}

