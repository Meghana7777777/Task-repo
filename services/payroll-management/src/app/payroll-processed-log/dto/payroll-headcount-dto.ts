import { ApiProperty } from "@nestjs/swagger";

export class PayrollHeadCountDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    payrollMonth: any;

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    createdAt: string;

    @ApiProperty({ nullable: true })
    createdUser: string | null;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty({ nullable: true })
    updatedUser: string | null;

    @ApiProperty()
    versionFlag: number;

    @ApiProperty()
    isActive: boolean;

}