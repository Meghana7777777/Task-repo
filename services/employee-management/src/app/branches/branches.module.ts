import { forwardRef, Module } from '@nestjs/common';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { BranchesRepository } from './repositories/branch-repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branches } from './branches.entity';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models'
import { EmployeeOnboardingModule } from '../employee-onboarding/employee-onboarding.module';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
@Module({
  imports:[TypeOrmModule.forFeature([Branches]),forwardRef(() =>EmployeeOnboardingModule )],
  controllers: [BranchesController],
  providers: [BranchesService,BranchesRepository, ApplicationExceptionHandler,EmployeeOnboardingService]
})
export class BranchesModule {}
