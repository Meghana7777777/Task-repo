import { CommonRequestAttrs } from "../ums-common";

export class AppModuleIdReqDto extends CommonRequestAttrs {
    appId: number;
    moduleId: number;
    constructor(username: string, userId: number, appId: number,moduleId: number) {
        super(username, userId);
        this.appId = appId;
        this.moduleId = moduleId;
    }
}