export class EmployeeEduDetailsDto {
    id: number;
    empQualification: number;
    specialization: string;
    yearOfPass: Date;
    percentage: number;
    university:string;
    collegeName:string;

    constructor(
        id: number,
        empQualification: number,
        specialization: string,
        yearOfPass: Date,
        percentage: number,
        university:string,
        collegeName:string,

    ) {
        this.id = id
        this.empQualification = empQualification
        this.specialization = specialization
        this.yearOfPass = yearOfPass
        this.percentage = percentage
        this.university = university
        this.collegeName = collegeName
    }
}
