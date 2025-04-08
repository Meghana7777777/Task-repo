export class GetAllApplicationsDto {
    applicationName: string;
    applicationId: number;
    description:string;
    isActive: boolean;
    versionFlag: number;
    constructor(
        applicationName: string,
        applicationId: number,
        description:string,
        isActive: boolean,
        versionFlag: number,
    ) {
        this.applicationName = applicationName;
        this.applicationId = applicationId;
       this. description=description;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
    }
}