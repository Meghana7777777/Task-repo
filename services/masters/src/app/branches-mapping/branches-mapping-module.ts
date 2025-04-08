import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models'
import { BranchesMappingEntity } from './entity/branches-mapping-entity';
import { BranchesMappingController } from './branches-mapping-controller';
import { BranchesMappingService } from './branches-mapping-service';
import { BranchesMappingRepo } from './repo/branches-mapping-repo';
@Module({
  imports:[TypeOrmModule.forFeature([BranchesMappingEntity])],
  controllers: [BranchesMappingController],
  providers: [BranchesMappingService,BranchesMappingRepo, ApplicationExceptionHandler]
})
export class BranchesMappingModule {}
