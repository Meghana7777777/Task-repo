import { ApiProperty } from "@nestjs/swagger";

export class WeekOffLeavesUpDateDTO {
    @ApiProperty()
    id: number;
  
    @ApiProperty()
    weekName: string;
    @ApiProperty()
    employeeCode: string;
    @ApiProperty()
    employeeName:string;
    @ApiProperty()
    employeeId: number
   
    @ApiProperty()
    isActive: boolean;
    @ApiProperty()
    createdUser: string;
    @ApiProperty()
    updatedUser: string;
    @ApiProperty()
    versionFlag: number;
    @ApiProperty()
    companyCode: string; // Add this if not present
  }