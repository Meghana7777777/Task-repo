import { MenusData } from "./menusData.dto";

export class UserPermissionsDto {
    userId: string;
    userName: string;
    roleId: string[];
    roleName: string[];
    menusData: MenusData[];
    employeeId?:string
    employeeCode?:string
    unit?:string
    unitId?:string
    branchChildren?:any

    constructor(userId: string, userName: string, roleId: string[], roleName: string[], menusData: MenusData[],employeeId?:string,
        employeeCode?:string,
        unit?:string,unitId?:string,branchChildren?:any) {
        this.userId = userId;
        this.userName = userName
        this.roleId = roleId
        this.roleName = roleName
        this.menusData = menusData
        this.employeeId = employeeId
        this.employeeCode = employeeCode
        this.unit= unit
        this.unitId = unitId
        this.branchChildren = branchChildren
    }
}