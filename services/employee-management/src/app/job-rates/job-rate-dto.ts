
import { ApiProperty } from "@nestjs/swagger";

export class JobRatesDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  rate: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdUser: string;
  @ApiProperty()
  updatedUser: string;
  @ApiProperty()
  versionFlag: number;
}

