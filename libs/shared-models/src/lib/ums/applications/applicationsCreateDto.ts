export class ApplicationsCreateDto {
    applicationName: string;
    applicationId: number;
    description:string;
    versionFlag: number;
    constructor(
        applicationName: string,
        applicationId: number,
        description:string,
        versionFlag: number,
    ) {
        this.applicationName = applicationName;
        this.applicationId = applicationId;
       this. description=description;
        this.versionFlag = versionFlag;
    }
}