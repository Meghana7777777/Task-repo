export class AttendanceAdjustRequest {
    // empId?:string
    empCode?:string
    date?: string;


    /**
     * 
     * @param empCode
     * @param date 
     */

    constructor( empCode?:string,date?: string) {
        this.date = date
        this.empCode = empCode

    }
}