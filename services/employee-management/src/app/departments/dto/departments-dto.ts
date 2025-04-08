import { ApiProperty } from "@nestjs/swagger";

export class DepartmentsDTO {
    @ApiProperty()
    id: number

    @ApiProperty()
    empId: number

    @ApiProperty()
    name: string

    @ApiProperty()
    code: string
    
    @ApiProperty()
    hod: string

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    versionFlag: number;

}
