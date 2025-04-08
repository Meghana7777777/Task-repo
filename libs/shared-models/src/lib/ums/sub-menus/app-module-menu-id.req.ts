import { CommonRequestAttrs } from "../ums-common";

export class AppModuleMenuIdReqDto extends CommonRequestAttrs {
    appId: number;
    moduleId: number;
    menuId: number;
    constructor(username: string, userId: number, appId: number,moduleId: number,menuId: number) {
        super(username, userId);
        this.appId = appId;
        this.moduleId = moduleId;
        this.menuId = menuId;
    }
}