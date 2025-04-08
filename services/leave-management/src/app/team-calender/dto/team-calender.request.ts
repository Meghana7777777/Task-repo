import { ApiProperty } from "@nestjs/swagger";

export class TeamCalenderRequest{

    @ApiProperty()
    id:number;

    @ApiProperty()
    isActive:boolean;

    @ApiProperty()
    updatedUser:string;

    @ApiProperty()
    versionFlag:number;
}