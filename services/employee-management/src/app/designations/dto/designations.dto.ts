
import { ApiProperty } from "@nestjs/swagger";

export class DesignationsDto {

  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  designationCode: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdUser: string;
  @ApiProperty()
  updatedUser: string;
  @ApiProperty()
  versionFlag: number;

}

