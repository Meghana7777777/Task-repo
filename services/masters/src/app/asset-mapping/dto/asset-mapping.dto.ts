import { AssetTypeEnum } from "@hrexpert/shared-models";
import { ApiProperty } from "@nestjs/swagger";

export class AssetMappingDto {
    @ApiProperty()
    assetId: number;

    @ApiProperty()
    asset: string;

    @ApiProperty()
    assetType: AssetTypeEnum;

    @ApiProperty()
    isActive: boolean;
}