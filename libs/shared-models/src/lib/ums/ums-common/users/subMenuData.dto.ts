export class SubMenuData {
    key: string;
    subMenuId: string;
    title: string;
    iconType: string;
    iconName: string;
    path: string;
    componentName: string;
    scopes: string[];
    baseSubMenuId?: string;
    orderId: number;
    subMenuChildren?: SubMenuData[];
    isOnlyRouting?:boolean

    constructor(key: string, subMenuId: string, title: string, subMenuIconType: string, subMenuIconName: string, path: string, componentName: string, scopes: string[], orderId: number, baseSubMenuId?: string, subMenuChildren?: SubMenuData[],isOnlyRouting?:boolean) {
        this.key = key;
        this.subMenuId = subMenuId;
        this.title = title;
        this.iconType = subMenuIconType;
        this.iconName = subMenuIconName;
        this.path = path;
        this.componentName = componentName;
        this.orderId = orderId;
        this.scopes = scopes;
        this.baseSubMenuId = baseSubMenuId;
        this.subMenuChildren = subMenuChildren;
        this.isOnlyRouting = isOnlyRouting
    }
}