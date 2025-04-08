
import { ApiProperty } from "@nestjs/swagger";

export class ComponentNamesDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  componentName: string;
  @ApiProperty()
  componentNameCode: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  roundStrg: string;
  @ApiProperty()
  componentType: string;
  @ApiProperty()
  isDerived: string;
  // @ApiProperty()
  // derivedRule: Boolean;
  @ApiProperty()
  cutOffAmount: Boolean;
  @ApiProperty()
  calculatedRule: Boolean;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdUser: string;
  @ApiProperty()
  updatedUser: string;
  @ApiProperty()
  versionFlag: number;
}

