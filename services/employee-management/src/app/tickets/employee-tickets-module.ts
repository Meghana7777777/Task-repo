import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeTicketsController } from './employee-tickets-controller';
import { EmployeeTicketsService } from './employee-tickets-service';
import { EmployeeTicketsEntity } from './entities/employee-tickets-entity';
import { EmployeeTicketsRepository } from './entities/employee-tickets-repo';



@Module({
    imports: [
        TypeOrmModule.forFeature([EmployeeTicketsEntity])
    ],
    controllers: [EmployeeTicketsController],
    providers: [EmployeeTicketsService, EmployeeTicketsRepository, ApplicationExceptionHandler,],
})
export class EmployeeTicketsModule { }
