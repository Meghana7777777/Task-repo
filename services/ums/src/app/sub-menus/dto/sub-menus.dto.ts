import { ApiProperty } from '@nestjs/swagger';
import { IconType } from 'libs/shared-models/src/lib/ums/ums-common';


export class SubMenuDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;

  
  iconType: IconType;

  @ApiProperty()
  iconName: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  component: string;

  @ApiProperty()
  parentId: number;

  @ApiProperty()
  menu_id: number;
  isActive: boolean;
}

