 

import { ApiProperty } from "@nestjs/swagger";
import { GenderEnum, IdentityTypeEnum } from "libs/shared-models/src/lib/ums/ums-common";


export class CreateUserChildDTO {

    @ApiProperty()
    id?: string;
    @ApiProperty()
    unitIds: string;

    @ApiProperty()
    userId?: string;

    
    
}

