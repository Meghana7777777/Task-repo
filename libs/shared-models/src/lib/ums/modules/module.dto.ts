import { CommonRequestAttrs } from "../ums-common";

export class ModuleDto extends CommonRequestAttrs {
    moduleName: string;
    moduleId: number;
    moduleDescription: string;
    applicationId: number;
    application: string;
    isActive: boolean;
    versionFlag: number;
    // username: string
    constructor(
        username: string,
        userId: number,
        moduleId: number,
        moduleName: string,
        moduleDescription: string,
        applicationId: number,
        application: string,
        isActive: boolean,
        versionFlag: number,
    ) {
        super(username, userId);
        this.moduleName = moduleName;
        this.moduleId = moduleId;
        this.moduleDescription = moduleDescription;
        this.applicationId = applicationId;
        this.application = application;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
    }
}