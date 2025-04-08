import { CommonRequestAttrs } from "../ums-common";

export class OrganizationReqDto extends CommonRequestAttrs {
    organizationId: number;
    constructor(username: string, userId: number, organizationId: number) {
        super(username, userId)
        this.organizationId = organizationId;
    }
}