
import { ComponentTypeEnum, RoundStrgEnum, TypeEnum } from "@hrexpert/shared-models";
import { ApiProperty } from "@nestjs/swagger";

export class PayrollComponentsDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  componentName: string;

  @ApiProperty()
  columnName: string;

  @ApiProperty()
  columnOrder: number;

  @ApiProperty()
  isDerived: boolean;

  @ApiProperty()
  derivedRule: Text;

  @ApiProperty()
  roundStrg: RoundStrgEnum;

  @ApiProperty()
  calculatedRule: Text;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  effDate: string;

  @ApiProperty()
  type: TypeEnum;

  @ApiProperty()
  componentType: ComponentTypeEnum;

  @ApiProperty()
  isPfEarning: boolean;

  @ApiProperty()
  isEsiEarning: boolean;

  @ApiProperty()
  payrollType: string;
 
  @ApiProperty()
  state: string;

  @ApiProperty()
  createdUser: string;

  @ApiProperty()
  updatedUser: string;

  @ApiProperty()
  versionFlag: number;

}

