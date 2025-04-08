
import { ApiProperty } from "@nestjs/swagger";

export class SkillsDto {

  @ApiProperty()
  id: number;
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

