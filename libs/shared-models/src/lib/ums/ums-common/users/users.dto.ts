

import { CreateUserChildDTO } from "./create-user-child.dto";

export class UsersCreateDto {
  firstName: string;
  mobileNo: string;
  unitId: number;
  clientId: number;
  userName: string;
  email: string;
  password: string;
  salt: string;
  createdUser: string;
  filesData: any[];
  userId: number;
  authenticationId: number;
  versionFlag: number;
  employeeId?: string;
  employeeCode?: string;

  children: CreateUserChildDTO[]; // Array of child DTOs

  constructor(
    firstName: string,
    mobileNo: string,
    unitId: number,
    clientId: number,
    userName: string,
    email: string,
    password: string,
    salt: string,
    createdUser: string,
    filesData: any[],
    userId: number,
    authenticationId: number,
    versionFlag: number,
    children: CreateUserChildDTO[], // Include children in the constructor
    employeeId?: string,
    employeeCode?: string
  ) {
    this.firstName = firstName;
    this.mobileNo = mobileNo;
    this.unitId = unitId;
    this.clientId = clientId;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.salt = salt;
    this.createdUser = createdUser;
    this.filesData = filesData;
    this.userId = userId;
    this.authenticationId = authenticationId;
    this.versionFlag = versionFlag;
    this.children = children; // Assign the children
    this.employeeId = employeeId;
    this.employeeCode = employeeCode;
  }
}
