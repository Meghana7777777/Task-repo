
export class DivisionDto {
    id: number;
     divisionName: string;
     createdUser: string;
     isActive?: boolean
     versionFlag?: number;
     updatedUser?: string;
     updatedAt?: Date;
 
     constructor(id: number, divisionName: string,
     createdUser: string, isActive?: boolean, versionFlag?: number, updatedUser?: string,
         updatedAt?: Date) {
         this.id =id;
         this.divisionName = divisionName
         this.createdUser = createdUser;
         this.isActive = isActive;
         this.versionFlag = versionFlag;
         this.updatedUser = updatedUser;
         this.updatedAt = updatedAt;
 
     }
 }
 