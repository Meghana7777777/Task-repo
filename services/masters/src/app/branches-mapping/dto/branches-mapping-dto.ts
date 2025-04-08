import { ApiProperty } from "@nestjs/swagger";

export class BranchesMappingDto {

    @ApiProperty()
    branchId:number;

    @ApiProperty()
    divisionId:number;

    @ApiProperty()
    departmentId:number; 
    
    @ApiProperty()
    id: number;

    @ApiProperty()
    updatedUser: string;
    
    @ApiProperty()
    versionFlag: number;

    @ApiProperty()
    isActive: boolean;
}
