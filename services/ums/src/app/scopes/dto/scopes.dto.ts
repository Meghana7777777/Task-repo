import { ApiProperty } from '@nestjs/swagger';

export class ScopeDto {
    scopeId: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    code: string;
}
