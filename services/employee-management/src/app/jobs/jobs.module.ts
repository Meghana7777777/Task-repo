import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsEntity } from './jobs.entity';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { JobsRepository } from './jobs.repo';


@Module({
    imports: [TypeOrmModule.forFeature([JobsEntity])],
    controllers: [JobsController],
    providers: [JobsService, JobsRepository, ApplicationExceptionHandler],
})
export class JobsModule { }
