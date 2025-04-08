import { AssetTypeEnum } from "@hrexpert/shared-models";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('asset')
export class AssetMappingEntity {

    @PrimaryGeneratedColumn({ name: 'asset_id' })
    assetId: number;

    @Column('varchar', { length: 50, nullable: false, name: 'asset' })
    asset: string;

    @Column({ type: 'enum', enum: AssetTypeEnum, nullable: false, name: 'asset_type' })
    assetType: AssetTypeEnum;

    @Column('boolean', { default: true, nullable: false, name: 'is_active' })
    isActive: boolean;
}
