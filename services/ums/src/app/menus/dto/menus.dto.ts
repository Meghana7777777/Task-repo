import { ApiProperty } from '@nestjs/swagger';
import { IconType } from 'libs/shared-models/src/lib/ums/ums-common';


export class MenuDto {

  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  iconType: IconType;

  @ApiProperty()
  iconName: string;

  @ApiProperty()
  menuId: string;


}
