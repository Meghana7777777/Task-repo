import { ApiProperty } from "@nestjs/swagger";

export class ApplyLeaveBrachDto {

    @ApiProperty()
    branchId:string;

    @ApiProperty()
    leaveGroupId?: number
   

}
