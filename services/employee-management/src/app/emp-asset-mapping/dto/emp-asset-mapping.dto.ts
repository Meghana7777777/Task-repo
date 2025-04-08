import { ApiProperty } from '@nestjs/swagger';

export class EmpAsssetMappingDto {

    @ApiProperty()
    employeeAssetId: number;

    @ApiProperty()
    employeeId: number;

    @ApiProperty()
    assetId: string[];

    @ApiProperty()
    issuedDate: Date;

    @ApiProperty()
    branch: string;

    @ApiProperty()
    returnDate: Date;

    @ApiProperty()
    assetStatus: string;

    @ApiProperty()
    remarks: string;

    @ApiProperty()
    isActive: boolean;
}
