import { SubMenuData } from "./subMenuData.dto";

export class MenusData {
    menuId: string;
    menuName: string;
    menuIconType: string;
    menuIconName: string;
    subMenuData: SubMenuData[];

    constructor(menuId: string, menuName: string, menuIconType: string, menuIconName: string, subMenuData: SubMenuData[]) {
        this.menuId = menuId;
        this.menuName = menuName;
        this.menuIconType = menuIconType;
        this.menuIconName = menuIconName;
        this.subMenuData = subMenuData;
    }
}