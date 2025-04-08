import { CommonRequestAttrs, IconType } from "../ums-common";

export class SubMenuDto extends CommonRequestAttrs {
    subMenuId: number
    name: string;
    order: number
    iconType: IconType;
    iconName: string;
    path: string;
    component: string;
    parentId: number;
    parent: string;
    menuId: number;
    menuName: string;
    moduleName: string;
    moduleId: number;
    applicationId: number;
    application: string;
    isActive: boolean;
    versionFlag: number;
    isOnlyRouting?: boolean;
    constructor(
        username: string,
        userId: number,
        subMenuId: number,
        name: string,
        order: number,
        iconType: IconType,
        iconName: string,
        path: string,
        component: string,
        parentId: number,
        parent: string,
        menuId: number,
        menuName: string,
        moduleId: number,
        moduleName: string,
        applicationId: number,
        application: string,
        isActive: boolean,
        versionFlag: number,
        isOnlyRouting?: boolean
    ) {
        super(username, userId);
        this.subMenuId = subMenuId
        this.name = name;
        this.order = order;
        this.iconType = iconType;
        this.iconName = iconName;
        this.path = path;
        this.component = component;
        this.parentId = parentId;
        this.parent = parent;
        this.menuId = menuId;
        this.menuName = menuName;
        this.moduleId = moduleId;
        this.moduleName = moduleName;
        this.applicationId = applicationId;
        this.application = application;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.isOnlyRouting = isOnlyRouting;
    }
}