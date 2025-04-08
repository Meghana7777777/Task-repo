import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommonResponseModel } from "@hrexpert/backend-utils";
import { AssetMappingEntity } from "./entity/asset-mapping.entity";
import { AssetMappingDto } from "./dto/asset-mapping.dto";

@Injectable()
export class AssetService {
    constructor(
        @InjectRepository(AssetMappingEntity)
        private readonly assetRepository: Repository<AssetMappingEntity>
    ) { }

    async createAsset(dto: AssetMappingDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.assetRepository.findOne({
                where: { asset: dto.asset }
            });
            if (exists) {
                return new CommonResponseModel(false, 3, 'Already exists');
            }
            const entity = new AssetMappingEntity();
            entity.asset = dto.asset
            entity.assetType = dto.assetType;
            entity.isActive = true;
            const savedEntity = await this.assetRepository.save(entity);
            return new CommonResponseModel(true, 1, 'Created Successfully', savedEntity);
        } catch (err) {
            console.error('Error in creating the asset:', err);
            return new CommonResponseModel(false, 0, 'Internal server error');
        }
    }

    async getAssets(): Promise<CommonResponseModel> {
        const data = await this.assetRepository.find({
            where: {
                isActive: true
            }
        });
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrivved Successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No Active Asset Type found', []);
    }

    async deactivateAsset(assetId: number): Promise<CommonResponseModel> {
        try {
            const assetType = await this.assetRepository.findOne({ where: { assetId } });

            if (!assetType) {
                return new CommonResponseModel(false, 0, 'asset Type not found');
            }

            assetType.isActive = false;
            await this.assetRepository.save(assetType);

            return new CommonResponseModel(true, 1, 'asset deactivated successfully');
        } catch (error) {
            console.error('Error deactivating asset:', error);
            return new CommonResponseModel(false, 0, 'Failed to deactivate asset');
        }
    }

    async updateAsset(assetId: number, dto: AssetMappingDto): Promise<CommonResponseModel> {
        try {
            console.log('ppppppppppppppp', assetId)
            console.log('dto', dto)
            const asset = await this.assetRepository.findOne({ where: { assetId } });


            if (!asset) {
                return new CommonResponseModel(false, 0, 'asset not found');
            }
            asset.asset = dto.asset ?? asset.asset;
            asset.assetType = dto.assetType ?? asset.assetType;
            const updatedExpense = await this.assetRepository.save(asset);
            return new CommonResponseModel(true, 1, 'asset updated successfully', updatedExpense);
        } catch (error) {
            console.error('Error updating asset:', error);
            return new CommonResponseModel(false, 0, 'Failed to update asset');
        }
    }

}
