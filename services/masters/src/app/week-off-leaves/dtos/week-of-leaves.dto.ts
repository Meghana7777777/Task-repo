
import { ApiProperty } from "@nestjs/swagger";
export class EmployeeDto{
  @ApiProperty()
  employeeId: number
//   @ApiProperty()
//   employeeCode: string;
//   @ApiProperty()
//  firstName:string;
}

export class WeekOffLeavesDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  weekName: string;
  
  @ApiProperty({ type: [EmployeeDto] })
  employee: EmployeeDto[];
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

