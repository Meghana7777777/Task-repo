import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignationsController } from './designations.controller';
import { DesignationsEntity } from './entites/designations.entity';
import { DesignationsRepository } from './repositories/designations.repository';
import { DesignationsService } from './designations.service';
@Module({
  imports:[TypeOrmModule.forFeature([DesignationsEntity])],
  controllers: [DesignationsController],
  providers: [DesignationsRepository,DesignationsService,ApplicationExceptionHandler]
})
export class DesignationsModule {}
