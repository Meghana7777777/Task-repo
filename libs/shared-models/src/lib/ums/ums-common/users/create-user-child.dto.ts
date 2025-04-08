export class CreateUserChildDTO {
   unitIds: any;
    userId: number; 
    unitName?:any
  
    constructor(unitIds:string,userId:number, unitName?:any) {
      this.unitIds = unitIds;
      this.userId =userId;
      this.unitName = unitName
     
    }
  }
  