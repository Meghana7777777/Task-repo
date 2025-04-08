import { CommonRequestAttrs } from "../ums-common";

export class UnitIdDto extends CommonRequestAttrs {
    unitId: number;
    constructor(username: string, userId: number, unitId: number) {
        super(username, userId)
        this.unitId = unitId;
    }
}