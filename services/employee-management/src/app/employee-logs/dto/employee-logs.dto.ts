import { SalutationEnum } from "@hrexpert/shared-models";
import { ApiProperty } from "@nestjs/swagger";
export class EmployeeLogsDTO {

    @ApiProperty()
    id: number;

    @ApiProperty()
    employeeId: number;

    @ApiProperty()
    actionType: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    previousValues: Text;

    @ApiProperty()
    updatedValues: Text;

    @ApiProperty()
    remarks: Text;

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    createdAt: Date;

}
