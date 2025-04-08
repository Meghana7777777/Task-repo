import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpAssetMappingEntity } from './entity/emp-asset-mapping.entity';
import { EmpAssetMappingService } from './emp-asset-mapping.service';
import { EmpAssetMappingController } from './emp-asset-mapping.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmpAssetMappingEntity
        ])
    ],
    controllers: [EmpAssetMappingController],
    providers: [EmpAssetMappingService, ApplicationExceptionHandler]
})
export class EmpAssetMappingModule { }
