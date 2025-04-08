import { ApiProperty } from "@nestjs/swagger";



export class LeaveGroupsDto {
    @ApiProperty()
     id: number;
    @ApiProperty()
    remarks: Text;
    @ApiProperty()
    code: string
   
   

    @ApiProperty()
    name: string

    @ApiProperty()
    isActive: boolean;
    
    createdAt: Date;

    @ApiProperty()
    createdUser: string;

    updatedAt: Date;
    
   

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    versionFlag: number;
}
