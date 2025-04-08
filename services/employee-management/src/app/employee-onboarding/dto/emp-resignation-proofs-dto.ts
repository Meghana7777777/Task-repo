import { ApiProperty } from "@nestjs/swagger";

export class EmpResignationDto {
    
    @ApiProperty()
    id: number;

    @ApiProperty()
    employeeId: number;

    @ApiProperty()
    employeeCode: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    dateOfReliving: string

    @ApiProperty()
    fileName: string;

    @ApiProperty()
    originalFileName: string;

    @ApiProperty()
    filePath: string;

    @ApiProperty()
    employeeRemarks: string;
    @ApiProperty()
    date?: string;
    @ApiProperty()
    type?: string;
    @ApiProperty()
    feedBackOn?: string;
    @ApiProperty()
    description?: string;
    @ApiProperty()
    impactOnBussiness?: string;
    @ApiProperty()
    createdUser?: string;
    @ApiProperty()
    updatedUser?: string;
    @ApiProperty()
    createdAt?: Date;
    @ApiProperty()
    updatedAt?: Date;
    @ApiProperty()
    isActive?: boolean;
    @ApiProperty()
    versionFlag?: number;

}