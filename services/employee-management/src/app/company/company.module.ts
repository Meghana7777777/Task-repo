import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { CompanyEntity } from './company.entity';
import { CompanyRepository } from './company.repo';
import { CompanyService } from './company.service';


@Module({
    imports: [TypeOrmModule.forFeature([CompanyEntity])],
    controllers: [CompanyController],
    providers: [CompanyService, CompanyRepository, ApplicationExceptionHandler],
})
export class CompanyModule { }
