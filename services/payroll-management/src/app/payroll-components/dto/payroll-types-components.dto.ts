
import { ApiProperty } from "@nestjs/swagger";

export class PayrollTypesComponentsDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdUser: string;

  @ApiProperty()
  updatedUser: string;

  @ApiProperty()
  versionFlag: number;

}

