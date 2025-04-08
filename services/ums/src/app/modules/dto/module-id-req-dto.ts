import { ApiProperty } from "@nestjs/swagger";
import { CommonRequestAttrs } from "libs/shared-models/src/lib/ums/ums-common";


export class ModuleIdReqDto extends CommonRequestAttrs {
    @ApiProperty()
    moduleId: number; 
    constructor(username: string, userId: number, moduleId: number) {
        super(username, userId);
        this.moduleId = moduleId;
    }
}