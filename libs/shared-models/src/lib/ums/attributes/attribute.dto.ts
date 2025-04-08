export class GetAllAttributeDto {
    attributeName: string;
    attributeId: number;
    isActive: boolean;
    versionFlag: number;
    constructor(
        attributeName: string,
        attributeId: number,
        isActive: boolean,
        versionFlag: number,
    ) {
        this.attributeName = attributeName;
        this.attributeId = attributeId;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
    }
}