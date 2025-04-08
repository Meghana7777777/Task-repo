import { Module } from '@nestjs/common';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { ShiftsEntity } from './shifts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { ShiftsRepository } from './repositories/shift-repo';

@Module({
  imports:[TypeOrmModule.forFeature([ShiftsEntity])],
  controllers: [ShiftsController],
  providers: [ShiftsService,ShiftsRepository, ApplicationExceptionHandler]
})
export class ShiftsModule {}
