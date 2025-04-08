import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/organization.entity';
import { OrganizationRepo } from './repo/organization.repo';
import { OrganizationAdapter } from './repo/adapter';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client])
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService,OrganizationRepo,OrganizationAdapter,ApplicationExceptionHandler],
  exports: [TypeOrmModule]
})
export class OrganizationModule { }
