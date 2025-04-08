import { ApiProperty } from "@nestjs/swagger";


export class ActivateMenuDto{
    @ApiProperty()
    menuId:number;
}