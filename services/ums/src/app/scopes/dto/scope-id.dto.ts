 
import { ApiProperty } from "@nestjs/swagger";
import { CommonRequestAttrs } from "libs/shared-models/src/lib/ums/ums-common";


export class ScopesIdDto extends CommonRequestAttrs{
    @ApiProperty()
    scopeId:number;
    constructor(username: string, userId: number, scopeId: number) {
        super(username, userId);
        this.scopeId = scopeId;
    }
}