import { ApiProperty } from '@nestjs/swagger';

export class FileUploadIdReq {
    @ApiProperty()
    fileUploadId: string;
    @ApiProperty()
    createdUser: string;
    @ApiProperty()
    unitCode: string;
}
