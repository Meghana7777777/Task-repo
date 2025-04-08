
import { ApiProperty } from "@nestjs/swagger";

export class PayrollEmployeesDto {

  @ApiProperty()
  id: number;
  @ApiProperty()
  employeeId: number;
  @ApiProperty()
  employeeCode: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdUser: string;
  @ApiProperty()
  updatedUser: string;
  @ApiProperty()
  versionFlag: number;

}

