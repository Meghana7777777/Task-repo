
import { ApiProperty } from "@nestjs/swagger";

export class CompanyDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  companyName: string;
  @ApiProperty()
  companyCode: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdUser: string;
  @ApiProperty()
  updatedUser: string;
  @ApiProperty()
  versionFlag: number;
}

