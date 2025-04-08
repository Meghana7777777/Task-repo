import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models'
import { ReasonsTypeEntity } from './reasons-type-entity';
import { ReasonsTypeController } from './reasons-type-controller';
import { ReasonsTypeService } from './reasons-type-service';
import { ReasonsTypeRepository } from './dto/reasons-type-repository';
@Module({
  imports:[TypeOrmModule.forFeature([ReasonsTypeEntity])],
  controllers: [ReasonsTypeController],
  providers: [ReasonsTypeService,ReasonsTypeRepository, ApplicationExceptionHandler]
})
export class ReasonsTypeModule {}
