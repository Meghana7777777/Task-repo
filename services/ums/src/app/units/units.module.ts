import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitEntity } from './entities/units.entity';
import { UnitAdapter } from './unit-adapters';
import { UnitsRepository } from './repo/unit.repository';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  imports: [TypeOrmModule.forFeature([UnitEntity])],
  controllers: [UnitsController],
  providers: [UnitsService, UnitAdapter, UnitsRepository,ApplicationExceptionHandler]
})
export class UnitsModule { }
