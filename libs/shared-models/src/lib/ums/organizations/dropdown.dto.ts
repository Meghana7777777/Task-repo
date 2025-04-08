export class DropdownOrganizationDto{
    name:string;
    organizationId:number;
    constructor(
        name:string,
        organizationId:number,
    ){
        this.name=name;
        this.organizationId=organizationId;
    }
  
}