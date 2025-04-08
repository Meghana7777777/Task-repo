import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsRateEntity } from './jobs-rate.entity';
import { JobsRateService } from './jobs-rate.service';
import { JobsRateController } from './jobs-rate.controller';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { JobsRateRepository } from './jobs-rate.repo';


@Module({
    imports: [TypeOrmModule.forFeature([JobsRateEntity])],
    controllers: [JobsRateController],
    providers: [JobsRateService, JobsRateRepository,  ApplicationExceptionHandler],
})
export class JobsRateModule { }
