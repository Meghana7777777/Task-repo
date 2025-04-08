import { ApiProperty } from "@nestjs/swagger"

export class LeaveAllocationReqDto{
    @ApiProperty()
    departmentId:number
    @ApiProperty()
    desginationid:number
    @ApiProperty()
    empolyeeId?:number
    @ApiProperty()
    divisionId?:number

    constructor(
       
        departmentId:number,
        desginationid:number,
        empolyeeId?:number,
        divisionId?:number,
        

    ){
       
        this.departmentId = departmentId
        this.desginationid = desginationid
        this.empolyeeId =empolyeeId
        this.divisionId = divisionId
    }
}