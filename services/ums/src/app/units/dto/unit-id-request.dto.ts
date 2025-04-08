 
import { ApiProperty } from '@nestjs/swagger';
import { CommonRequestAttrs } from 'libs/shared-models/src/lib/ums/ums-common';


export class UnitIdDto extends CommonRequestAttrs{
    @ApiProperty()
    unitId: number;
    constructor(username: string, userId: number, unitId: number){
        super (username, userId)
        this.unitId= unitId;
    }


}
