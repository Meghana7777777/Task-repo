import { CommonRequestAttrs } from "../ums-common";

export class UsersIdDto extends CommonRequestAttrs {
    usersId: number;
    appId?: number;
    unitId?:number
    constructor(username: string, userId: number, usersId: number,appId?:number,unitId?:number) {
        super(username, userId);
        this.usersId = usersId;
        this.appId = appId;
        this.unitId = unitId
    }

}