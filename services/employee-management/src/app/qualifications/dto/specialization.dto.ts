
import { ApiProperty } from "@nestjs/swagger";

export class SpecializationDto {

  @ApiProperty()
  id: number;
  @ApiProperty()
  specialization: string;
  @ApiProperty()
  qualificationId: number;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdUser: string;
  @ApiProperty()
  updatedUser: string;
  @ApiProperty()
  versionFlag: number;

}

