export class ValidationDateReq { 
    roomId : number;
    startDate ?: string;
    endDate ?: string;
    constructor(roomId : number, startDate ?: string, endDate ?: string){
        this.roomId = roomId;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}