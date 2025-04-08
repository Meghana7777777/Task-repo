export class ModulesDropDownDto {
    moduleName: string;
    id: number;
    constructor(
        moduleName: string,
        id: number
    ) {
        this.moduleName = moduleName;
        this.id = id;
    }
}