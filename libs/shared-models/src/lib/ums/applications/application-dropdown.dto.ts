export class ApplicationsDropDownDto {
    applicationName: string;
    id: number;
    constructor(
        applicationName: string,
        id: number
    ) {
        this.applicationName = applicationName;
        this.id = id;
    }
}