import { CommonRequestAttrs } from "../ums-common";

export class AttributeIdReqDto extends CommonRequestAttrs {
    attributeId: number;
    constructor(username: string, userId: number, attributeId: number) {
        super(username, userId)
        this.attributeId = attributeId;
    }
}