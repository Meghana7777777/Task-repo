export class MeetingRoomIdReq { 
    id : number;
    date ?: string;
    constructor(id : number, date ?: string){
        this.id = id;
        this.date = date;
    }
}