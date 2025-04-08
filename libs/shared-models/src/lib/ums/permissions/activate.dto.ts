import { CommonRequestAttrs } from "../ums-common";

export class ActivatePermissionDto extends CommonRequestAttrs {
    id: number;
    constructor(username: string, userId: number, id: number) {
        super(username, userId);
        this.id = id;
    }
}