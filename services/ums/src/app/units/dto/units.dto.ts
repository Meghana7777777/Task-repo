import { ApiProperty } from '@nestjs/swagger';

export class UnitDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  unitId: number
  @ApiProperty()
  description: string;
  @ApiProperty()
  organizationId: number;
  @ApiProperty()
  versionFlag: number;

}
