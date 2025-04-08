import { ApiOAuth2, ApiProperty } from '@nestjs/swagger';

export class UpdateExpensesDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    DateTime: string;
    @ApiProperty()
    isActive: boolean;
    @ApiProperty()
    createdUser: string;
    @ApiProperty()
    updatedUser: string;
    @ApiProperty()
    versionFlag: number;
    @ApiProperty()
    expensesAganist: string;
    @ApiProperty()
    employeeName: string;
    @ApiProperty()
    branch: string;
    @ApiProperty()
    branchManager: string;
    @ApiProperty()
    expensesType: string;
    @ApiProperty()
    amount: number;
    @ApiProperty()
    paymentMode: string;
    @ApiProperty()
    referenceNo: string;
    @ApiProperty()
    paymentStatus: string;
    @ApiProperty()
    taxApplicable: string;
    @ApiProperty()
    approved: string;
    // @ApiProperty({ required: false })
    // uploadFile?: string; //
    @ApiProperty()
    remarks: string;
}
