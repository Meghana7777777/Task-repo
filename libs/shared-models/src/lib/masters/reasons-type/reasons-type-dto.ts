export class ReasonsTypeDto {
  id: number;
  name: string;
  isActive: boolean;
  createdUser: string;
  updatedUser: string;
  versionFlag: number;
  companyCode: string; 
  constructor(
  id: number,
  name: string,
  isActive: boolean,
  createdUser: string,
  updatedUser: string,
  versionFlag: number,
  companyCode: string
)
  {
    this.id = id
    this.name = name
    this.isActive = isActive
    this.createdUser = createdUser
    this.updatedUser = updatedUser
    this.versionFlag = versionFlag
    this.companyCode = companyCode
  }
}

