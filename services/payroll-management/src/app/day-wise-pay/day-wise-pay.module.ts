import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayWisePayController } from './day-wise-pay.controller';
import { DayWisePayEntity } from './day-wise-pay.entity';
import { DayWisePayRepository } from './day-wise-pay.repo';
import { DayWisePayService } from './day-wise-pay.service';

@Module({
    imports: [TypeOrmModule.forFeature([DayWisePayEntity])],
    controllers: [DayWisePayController],
    providers: [DayWisePayService, DayWisePayRepository, ApplicationExceptionHandler],
    exports: [DayWisePayService, DayWisePayRepository]
})
export class DayWisePayModule { }
