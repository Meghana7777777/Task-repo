
import { ApiProperty } from "@nestjs/swagger";

export class PayrollEmployeeComponentAmountsDto {

  @ApiProperty()
  id: number;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  validFrom: Date;
  @ApiProperty()
  validTo: Date;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdUser: string;
  @ApiProperty()
  updatedUser: string;
  @ApiProperty()
  versionFlag: number;

}

