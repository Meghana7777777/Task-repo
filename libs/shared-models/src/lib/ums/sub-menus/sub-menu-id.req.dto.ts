import { CommonRequestAttrs } from "../ums-common";

export class SubMenuIdReqDto extends CommonRequestAttrs {
    subMenuId: number;
    constructor(username: string, userId: number, subMenuId: number) {
        super(username, userId);
        this.subMenuId = subMenuId;
    }
}