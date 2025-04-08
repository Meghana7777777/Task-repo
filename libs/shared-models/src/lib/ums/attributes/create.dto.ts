export class CreateAttributeDto {
    attributeName: string;
    attributeId: number; 
    versionFlag: number;
    constructor(
        attributeName: string,
        attributeId: number, 
        versionFlag: number,
    ) {
        this.attributeName = attributeName;
        this.attributeId = attributeId;
        this.versionFlag = versionFlag;
    }
}