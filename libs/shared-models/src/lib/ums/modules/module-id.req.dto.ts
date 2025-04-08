import { CommonRequestAttrs } from "../ums-common";

export class ModulesIdReqDto extends CommonRequestAttrs {
    moduleId: number;
    constructor(username: string, userId: number, moduleId: number) {
        super(username, userId);
        this.moduleId = moduleId;
    }
}