 
import { ApiProperty } from "@nestjs/swagger";
import { CommonRequestAttrs } from "libs/shared-models/src/lib/ums/ums-common";



export class OrganizationIdReqDto extends CommonRequestAttrs{
    @ApiProperty()
    organizationId:number;
    constructor(username: string, userId: number, organizationId: number) {
        super(username, userId);
        this.organizationId = organizationId;
    }
}