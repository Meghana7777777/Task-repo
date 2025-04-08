import { MenusData } from "./menusData.dto";

export class UserPermissionsDto {
    userId: number;
    name:string;
    userName: string;
    roleId: string[];
    roleName: string[];
    menusData: MenusData[];
    employeeId?: string;
    employeeCode?: string;
    unitId?:any
    unit?:string
    email?:string
    branchChildren?:any
    /**
     * 
     * @param userId 
     * @param userName 
     * @param roleId 
     * @param roleName 
     * @param menusData 
     * @param employeeId 
     */
    constructor(userId: number, userName: string, roleId: string[], roleName: string[], menusData: MenusData[], employeeId: string,employeeCode: string, unitId?:any,unit?:string,email?:string,branchChildren?:any) {
        this.userId = userId;
        this.userName = userName;
        this.roleId = roleId;
        this.roleName = roleName;
        this.menusData = menusData;
        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.unitId = unitId
        this.unit =unit
        this.email =email
        this.branchChildren =branchChildren
    }
}