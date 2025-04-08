

export class EmployeeExperienceDetailsDto {
    id: number;
    organisation: string;
    fromDate: Date;
    toDate: Date;
    yearOfExp: number;
    file?: string

    constructor(
        id: number,
        organisation: string,
        fromDate: Date,
        toDate: Date,
        yearOfExp: number,
        file?: string

    ) {
        this.id = id
        this.organisation = organisation
        this.fromDate = fromDate
        this.toDate = toDate
        this.yearOfExp = yearOfExp
        this.file = file
    }
}