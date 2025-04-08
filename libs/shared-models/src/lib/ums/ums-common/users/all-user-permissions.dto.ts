export class AllUserPermissionsResponseDto {

    userId: number;
    name:string;
    userName: string;
    roleId: string;
    roleName: string;
    permissionsId: string;
    subMenuId: string;
    subMenuName: string;
    subMenuIconType: string;
    subMenuIconName: string;
    path: string;
    component: string;
    scopeId: string;
    scope: string;
    menuId: string;
    menuName: string;
    menuIconType: string;
    menuIconName: string;
    smOrder: number;
    mOrder: number;
    baseSubMenuId?: string;
    unitId?:string
    unit?:string;
    employeeId?:string
    employeeCode?:string
    isOnlyRouting?:boolean


    constructor(userId: number,name:string, userName: string, roleId: string, roleName: string, permissionsId: string, subMenuId: string, subMenuName: string, subMenuIconType: string, subMenuIconName: string, path: string, component: string, scopeId: string, scope: string, menuId: string, menuName: string, menuIconType: string, menuIconName: string, smOrder: number, mOrder: number, baseSubMenuId?: string,unitId?:string,unit?:string,employeeId?:string,
        employeeCode?:string,isOnlyRouting?:boolean) {
        this.userId = userId;
        this.name = name;
        this.userName = userName;
        this.roleId = roleId
        this.roleName = roleName
        this.permissionsId = permissionsId
        this.subMenuId = subMenuId
        this.subMenuName = subMenuName
        this.subMenuIconType = subMenuIconType
        this.subMenuIconName = subMenuIconName
        this.path = path
        this.component = component
        this.scopeId = scopeId
        this.scope = scope
        this.menuId = menuId
        this.smOrder = smOrder
        this.mOrder = mOrder
        this.menuName = menuName
        this.menuIconType = menuIconType
        this.menuIconName = menuIconName
        this.baseSubMenuId = baseSubMenuId
        this.unitId = unitId;
    this.unit = unit
    this.employeeId =employeeId
    this.employeeCode = employeeCode
    this.isOnlyRouting = isOnlyRouting
    }

}