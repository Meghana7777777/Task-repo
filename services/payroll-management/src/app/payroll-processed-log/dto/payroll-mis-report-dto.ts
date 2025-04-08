import { ApiProperty } from "@nestjs/swagger";

export class PayrollMisReportDto {

    @ApiProperty()
    payrollYear: string;

    @ApiProperty()
    branchId: number;
  
    @ApiProperty()
    payMode: string;
   

}