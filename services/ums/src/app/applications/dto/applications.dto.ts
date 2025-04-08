import { ApiProperty } from "@nestjs/swagger";
import { AbstractDto } from "services/ums/src/database/common-entities/abstract.dto";


export class ApplicationsDto extends AbstractDto {
  @ApiProperty()
  applicationName: string
  @ApiProperty()
  description: string;
  @ApiProperty()
  applicationId: number;

 
}
