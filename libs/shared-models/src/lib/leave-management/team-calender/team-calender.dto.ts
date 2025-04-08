export class TeamCalenderDto{
    id:number;
    shiftCode:string;
    fromDate:any;
    toDate:any;
    shift:any;
    isActive:boolean;
    updatedUser:string;
    updatedAt:Date;
    createdUser:string;
    createdAt:Date;
    versionFlag:number;

    /**
     * 
     * @param id 
     * @param shiftCode 
     * @param fromDate 
     * @param toDate 
     * @param shift 
     * @param isActive 
     * @param updatedUser 
     * @param updatedAt 
     * @param createdUser 
     * @param createdAt 
     * @param versionFlag 
     */

    constructor( id:number,shiftCode:string,fromDate:Date,toDate:Date,shift:any,isActive:boolean,updatedUser:string,updatedAt:Date,createdUser:string,createdAt:Date,versionFlag:number){
        this.id = id;
        this.shiftCode = shiftCode;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.shift = shift;
        this.isActive = isActive;
        this.updatedUser = updatedUser;
        this.updatedAt = updatedAt;
        this.createdUser = createdUser;
        this.createdAt = createdAt;
        this.versionFlag = versionFlag;

    }
}