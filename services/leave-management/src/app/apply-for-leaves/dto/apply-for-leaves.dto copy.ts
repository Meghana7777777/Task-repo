import { ApiProperty } from "@nestjs/swagger";

export class EmployeesNamesDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    employeeCode: string;

    @ApiProperty()
    employeeName: string;

}
