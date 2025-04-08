
import { ApiProperty } from "@nestjs/swagger";
import { CommonRequestAttrs } from "libs/shared-models/src/lib/ums/ums-common";

export class ModuleDto extends CommonRequestAttrs {
  @ApiProperty()
  moduleName: string
  @ApiProperty()
  moduleId: number
  @ApiProperty()
  moduleDescription: string
  @ApiProperty()
  applicationId: number
  @ApiProperty()
  application: string
  @ApiProperty()
  isActive: boolean
  @ApiProperty()
  versionFlag: number;
  @ApiProperty()
  username: string;
}