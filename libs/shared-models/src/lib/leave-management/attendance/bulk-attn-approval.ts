export class BulkAttendanceApproval{
    employeeId:number
    inTime:any
    outTime:any
    date:any
    shift:number
    shiftGroup:number
    status:string
    attnAdjId:number
    constructor(
        employeeId?:number,
        inTime?:any,
        outTime?:any,
        date?:any,
        shift?:number,
        shiftGroup?:number,
        status?:string,
        attnAdjId?:number
    ){
        this.employeeId = employeeId
        this.inTime = inTime
        this.outTime = outTime
        this.date = date
        this.shift = shift
        this.shiftGroup = shiftGroup
        this.status = status
        this.attnAdjId = attnAdjId
    }


}