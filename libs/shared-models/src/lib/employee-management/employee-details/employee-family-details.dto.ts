export class EmployeeFamilyDetailsDto {
    id: number;
    familyMemName: string;
    relation: number;
    contactNo: string;
    familyIdType: number;
    aadhaarNo: string;
    employeeId: number;
    constructor(
        id: number,
        familyMemName: string,
        relation: number,
        contactNo: string,
        familyIdType: number,
        aadhaarNo: string,
        employeeId: number,

    ) {
        this.id = id
        this.familyMemName = familyMemName
        this.relation = relation
        this.contactNo = contactNo
        this.familyIdType = familyIdType
        this.aadhaarNo = aadhaarNo
        this.employeeId = employeeId
    }
}