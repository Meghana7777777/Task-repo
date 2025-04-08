export class RoomBookingDto{
    roomId : number;
    startTime : string;
    endTime : string;
    purpose : string;
    remarks : string;
    createdUser : string;
    roomApprover: string;

    constructor(roomId : number, startTime : string, endTime : string, purpose : string, remarks : string,createdUser : string, roomApprover: string){
        this.roomId = roomId;
        this.startTime = startTime;
        this.endTime = endTime
        this.purpose = purpose;
        this.remarks = remarks;
        this.createdUser = createdUser;
        this.roomApprover = roomApprover;
    }

}