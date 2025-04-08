
export class ComponentNamesReq {
    id: number;
    componentName: string;
    componentNameCode: string;
    createdUser: string;
    isActive?: boolean
    versionFlag?: number;
    updatedUser?: string;
    updatedAt?: Date;

    constructor(id: number, componentName: string, componentNameCode: string,
        createdUser: string, isActive?: boolean, versionFlag?: number, updatedUser?: string,
        updatedAt?: Date) {
        this.id = id;
        this.componentName = componentName;
        this.componentNameCode = componentNameCode;
        this.createdUser = createdUser;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.updatedUser = updatedUser;
        this.updatedAt = updatedAt;

    }
}
