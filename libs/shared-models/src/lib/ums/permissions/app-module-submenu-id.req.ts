import { CommonRequestAttrs } from "../ums-common";

export class AppModuleSubMenuIdReqDto extends CommonRequestAttrs {
    appId: number;
    moduleId: number;
    subMenuId: number;
    constructor(username: string, userId: number, appId: number, moduleId: number, subMenuId: number) {
        super(username, userId);
        this.appId = appId;
        this.moduleId = moduleId;
        this.subMenuId = subMenuId;
    }
}