export class MenusDropdownDto{
    name: string;
    menuId: number;
    constructor(name:string, menuId: number){
        this.name=name;
        this.menuId=menuId;
    }
}