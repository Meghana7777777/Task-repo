import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models'
import { WeekOffLeavesRepository } from './dtos/week-of-leaves.repo';
import { WeekOffLeavesController } from './week-of-leaves.controller';
import { WeekOffLeaves } from './week-of-leaves.entity';
import { WeekOffLeavesService } from './week-of-leaves.service';

@Module({
  imports:[TypeOrmModule.forFeature([WeekOffLeaves])],
  controllers: [WeekOffLeavesController],
  providers: [WeekOffLeavesService,WeekOffLeavesRepository, ApplicationExceptionHandler]
})
export class WeekOffLeavesModule {}
