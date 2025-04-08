import { ApiProperty } from '@nestjs/swagger';

export class PermDto {
 
  @ApiProperty()
  name: string;

  
  @ApiProperty()
 subMenuId: number;

  
  @ApiProperty()
 scopeId: number;
 @ApiProperty()
 permissionId:number;
 
}
