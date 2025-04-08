export class OrganizationCreateDto {
    name: string;
    description: string;
    organizationId: number;
    versionFlag: number;
    constructor(
        name: string,
        description: string,
        organizationId: number,
        versionFlag: number
    ) {
        this.name = name;
        this.description = description;
        this.organizationId = organizationId;
        this.versionFlag = versionFlag;
    }
}