
import { ApiProperty } from "@nestjs/swagger";

export class PayrollRecordsDto {

  @ApiProperty()
  id: number;
 
  @ApiProperty()
  payrollMonth: number;

  @ApiProperty()
  payrollWeek: number;

  @ApiProperty()
  payMonthStartDate: Date;

  @ApiProperty()
  payMonthEndDate: Date;

  @ApiProperty()
  actualAmount?: number;

  @ApiProperty()
  calculatedAmount?: number;
  
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdUser: string;
  @ApiProperty()
  updatedUser: string;
  @ApiProperty()
  versionFlag: number;

}

