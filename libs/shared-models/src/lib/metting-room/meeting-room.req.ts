export class MeetingRoomReq {
    id: number;
    meetingRoom: number;
    createdUser: string;
    imagePath?: string;
    constructor(id: number, meetingRoom: number, createdUser:string, imagePath?: string) {
        this.id = id;
        this.meetingRoom = meetingRoom;
        this.createdUser = createdUser;
        this.imagePath = imagePath;
    }

}