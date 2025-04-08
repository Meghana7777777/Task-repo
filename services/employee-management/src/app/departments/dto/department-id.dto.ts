import { ApiProperty } from "@nestjs/swagger";


export class DepartmentIdDto {
    @ApiProperty()
    // @IsString()
    departmentId: number;

}

