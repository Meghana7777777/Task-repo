export class TeamCalenderRequest{
    id:number;
    isActive:boolean;
    updatedUser:string;
    versionFlag:number;

    /**
     * 
     * @param id 
     * @param isActive 
     * @param updatedUser 
     * @param versionFlag 
     */

    constructor(id:number,isActive:boolean,updatedUser:string,versionFlag:number){
        this.id = id;
        this.isActive = isActive;
        this.updatedUser = updatedUser;
        this.versionFlag = versionFlag;

    }
}