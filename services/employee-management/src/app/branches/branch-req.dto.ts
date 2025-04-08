
import { ApiProperty } from "@nestjs/swagger";

export class BranchReqDto {
  @ApiProperty()
  unitId: number;

  
}

export class BranchIdDto {
  @ApiProperty()
  branchId: number;

  
}

