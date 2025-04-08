export class ScopesCreateDto {
    name: string;
    code: number;
    scopeId: number;
    versionFlag: number;
    constructor(
        name: string,
        code: number,
        scopeId: number,
        versionFlag: number,
    ) {
        this.name = name;
        this.code = code;
        this.scopeId = scopeId;
        this.versionFlag = versionFlag;
    }
}