import { ApiProperty } from "@nestjs/swagger";
import { CommonRequestAttrs } from "libs/shared-models/src/lib/ums/ums-common";


export class AttributeIdReqDto extends CommonRequestAttrs {
    @ApiProperty()
    attributeId: number;
    constructor(username: string, userId: number, attributeId: number) {
        super(username, userId)
        this.attributeId  =attributeId;
    }
}