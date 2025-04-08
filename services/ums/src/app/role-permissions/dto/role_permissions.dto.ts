import { ApiProperty } from '@nestjs/swagger';

export class RolePermDto {
  @ApiProperty()
  subMenuId: number;
  @ApiProperty()
  permissionIds: number[];
  @ApiProperty()
  roleId: number;
}
