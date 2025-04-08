export class BranchesMappingSharedDto {
id:number;
    branchId:number;
    divisionId:number;
    departmentId:number;
    isActive: boolean

    constructor (
        id:number,
        branchId:number,
        divisionId:number,
        departmentId:number,
        isActive: boolean
    ) {
        this.id = id
        this.branchId = branchId
        this.divisionId = divisionId
        this.departmentId = departmentId
        this.isActive = isActive
    }
}