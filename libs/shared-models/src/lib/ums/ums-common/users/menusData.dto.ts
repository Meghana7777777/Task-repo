import { SubMenuData } from "./subMenuData.dto";

export class MenusData {
    key: string;
    menuId: string;
    title: string;
    iconType: string;
    iconName: string;
    subMenuData: SubMenuData[];
    orderId: number;

    constructor(key: string,menuId: string, title: string, menuIconType: string, menuIconName: string, subMenuData: SubMenuData[],orderId: number) {
        this.key = key;
        this.menuId = menuId;
        this.title = title;
        this.iconType = menuIconType;
        this.iconName = menuIconName;
        this.subMenuData = subMenuData;
        this.orderId = orderId;
    }
}