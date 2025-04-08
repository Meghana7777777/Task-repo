import { ApiProperty } from "@nestjs/swagger"

export class MonthWIseEmpReportDto{
    @ApiProperty()
    month : string;

    @ApiProperty()
    year:string;

    @ApiProperty()
    division:string;

    @ApiProperty()
    department:string;

    @ApiProperty()
    branch:string;

    @ApiProperty()
    isExcel?:boolean;
   

    constructor(
        month:string,
        year:string,
        division: string,
        department: string,
        branch: string,
        isExcel?:boolean
        
    ){
        this.month = month
        this.year = year    
        this.division = division
        this.department = department
        this.branch = branch   
        this.isExcel = isExcel
    }
}