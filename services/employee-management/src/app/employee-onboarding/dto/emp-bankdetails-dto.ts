import { ApiProperty } from "@nestjs/swagger";

export class BankPayDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    empCode: number;
    @ApiProperty()
    empName: string;
    @ApiProperty()
    mobNo: number;
    @ApiProperty()
    bankName: string;
    @ApiProperty()
    bankAccNo: number;
    @ApiProperty()
    bankIfscNo: string;
    @ApiProperty()
    deptName: string;
    @ApiProperty()
    salary: string
}