
import { ApiProperty } from "@nestjs/swagger";

export class EmpNonRecComponentsDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  emiCount: number;

  @ApiProperty()
  emiAmount: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdUser: string;

  @ApiProperty()
  updatedUser: string;

  @ApiProperty()
  versionFlag: number;

}

