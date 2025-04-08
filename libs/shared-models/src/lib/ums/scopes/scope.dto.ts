export class GetAllScopesDto {
    name: string;
    scopeId: number;
    code: string;
    isActive: boolean;
    versionFlag: number;
    constructor(
        name: string,
        scopeId: number,
        code: string,
        isActive: boolean,
        versionFlag: number,
    ) {
        this.name = name;
        this.scopeId = scopeId;
        this.code = code;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
    }
}