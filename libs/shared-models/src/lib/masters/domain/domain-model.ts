export class DomainModelDto {
    domainId: number;
    domainType: string;
    isActive: boolean;
    constructor(
        domainId: number,
        domainType: string,
        isActive: boolean,
    ) {
        this.domainId = domainId
        this.domainType = domainType
        this.isActive = isActive
    }
}

