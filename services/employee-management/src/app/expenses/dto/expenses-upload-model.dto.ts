import { ApiProperty } from '@nestjs/swagger';

export class ExpenseFileUploadIdReq {
    @ApiProperty()
    fileUploadId: string;
    @ApiProperty()
    createdUser: string;
    @ApiProperty()
    unitCode: string;
}