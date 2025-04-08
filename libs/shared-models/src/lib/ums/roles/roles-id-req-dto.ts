import { CommonRequestAttrs } from "../ums-common";

export class RolesIdReqDto extends CommonRequestAttrs {
    rolesId: number
    constructor(username: string, userId: number, rolesId: number) {
        super(username, userId);
        this.rolesId = rolesId;
    }
}