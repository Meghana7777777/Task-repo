import { ApiProperty } from '@nestjs/swagger';
export class RolesDto {
  @ApiProperty()
  roleName: string;

  @ApiProperty()
  unitId: number

  @ApiProperty()
  description: string;

  @ApiProperty()
  rolesId: number;

  @ApiProperty()
  versionFlag:number;
 

}
