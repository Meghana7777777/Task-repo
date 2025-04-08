import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeLogsController } from './employee-logs.controller';
import { EmployeeLogsService } from './employee-logs.service';
import { EmployeeLogsEntity } from './entities/employee-logs.entity';
import { EmployeeLogsRepository } from './repositorys/employee-logs-repo';


@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeLogsEntity])
  ],
  controllers: [EmployeeLogsController],
  providers: [EmployeeLogsRepository,EmployeeLogsService,ApplicationExceptionHandler, ],
})
export class EmployeeLogsModule { }
