import { CommonRequestAttrs, IconType } from "../ums-common";

export class MenusDto extends CommonRequestAttrs {
    menuName: string;
    order: number;
    iconType: IconType;
    iconName: string;
    path: string;
    component: string;
    isActive: boolean;
    versionFlag: number;
    menuId: number;
    moduleName: string;
    moduleId: number;
    applicationId: number;
    application: string;
    constructor(
        username: string,
        userId: number,
        menuId: number,
        menuName: string,
        order: number,
        iconType: IconType,
        iconName: string,
        path: string,
        component: string,
        isActive: boolean,
        versionFlag: number,
        moduleId: number,
        moduleName: string,
        applicationId: number,
        application: string
    ) {
        super(username, userId);
        this.menuId = menuId;
        this.menuName = menuName;
        this.applicationId = applicationId;
        this.application = application;
        this.order = order;
        this.iconName = iconName;
        this.iconType = iconType;
        this.path = path;
        this.component = component;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.moduleId = moduleId;
        this.moduleName = moduleName;
    }
}


