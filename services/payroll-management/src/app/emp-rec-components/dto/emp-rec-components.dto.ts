
import { ApiProperty } from "@nestjs/swagger";

export class EmpRecComponentsDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdUser: string;

  @ApiProperty()
  updatedUser: string;

  @ApiProperty()
  versionFlag: number;

  @ApiProperty()
  employeeId: number;

  @ApiProperty()
  componentId: number;

  @ApiProperty()
  emiCount: number;

  @ApiProperty()
  emiAmount: number;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty()
  totalTerms: number;

  @ApiProperty()
  termCount: number;

  @ApiProperty()
  isDerived: number;

  @ApiProperty()
  componentType: string;

  @ApiProperty()
  isPermanent: string;

}


