import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Relations } from './relations.entity';
import { RelationsController } from './relations.controller';
import { RelationsService } from './relations.service';
import { RelationsRepository } from './dto/relations.repo';


@Module({
  imports:[TypeOrmModule.forFeature([Relations])],
  controllers: [RelationsController],
  providers: [RelationsService,RelationsRepository, ApplicationExceptionHandler]
})
export class RelationsModule {}
