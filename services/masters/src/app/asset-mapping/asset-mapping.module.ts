import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationExceptionHandler } from "@hrexpert/backend-utils";
import { AssetMappingEntity } from "./entity/asset-mapping.entity";
import { AssetService } from "./asset-mapping.service";
import { AssetController } from "./asset-mapping.controller";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            AssetMappingEntity
        ])
    ],
    controllers: [AssetController],
    providers: [AssetService, ApplicationExceptionHandler]
})
export class AssetMOdule { }