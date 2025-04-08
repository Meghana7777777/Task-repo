import { CreateUserChildDTO } from "../ums-common/users/create-user-child.dto";

export class GetAllUsersDto {
  firstName: string;
  mobileNo: string;
  employeeId: string;
  employeeCode: string;
  versionFlag: number;
  isActive: boolean;
  userId: number;
  unitId?: any;
  email?:any;
  userName?:any

  children: CreateUserChildDTO[]

  constructor(
    firstName: string,
    mobileNo: string,
    employeeId: string,
    employeeCode: string,
    versionFlag: number,
    isActive: boolean,
    userId: number,
    unitId?: any,
    email?:any,
    userName?:any,
    children?: CreateUserChildDTO[]
  ) {
    this.firstName = firstName;
    this.employeeId = employeeId;
    this.employeeCode = employeeCode;
    this.mobileNo = mobileNo;
    this.userId = userId;
    this.isActive = isActive;
    this.versionFlag = versionFlag;
    this.unitId = unitId;
    this.email =email
    this.userName =userName
    this.children = children; 
  }
}
