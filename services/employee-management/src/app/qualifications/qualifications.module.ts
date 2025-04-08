import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualificationsEntity } from './entites/qualifications.entity';
import { QualificationsController } from './qualifications.controller';
import { QualificationsService } from './qualifications.service';
import { QualificationsRepository } from './repositories/qualifications.repository';
import { SpecializationsEntity } from './entites/specializations.entity';
import { SpecializationRepository } from './repositories/specialization.repository';
@Module({
  imports:[TypeOrmModule.forFeature([QualificationsEntity, SpecializationsEntity])],
  controllers: [QualificationsController],
  providers: [QualificationsRepository,QualificationsService,ApplicationExceptionHandler, SpecializationRepository]
})
export class QualificationsModule {}
