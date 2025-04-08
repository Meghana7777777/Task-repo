export class IdProofDto {
    id: number;
    name: string;
    isActive: boolean;
    createdUser: string;
    updatedUser: string;
    versionFlag: number;
    companyCode: string; // Add this if not present
    constructor(
    id?: number,
    name?: string,
    isActive?: boolean,
    createdUser?: string,
    updatedUser?: string,
    versionFlag?: number,
    companyCode?: string)
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