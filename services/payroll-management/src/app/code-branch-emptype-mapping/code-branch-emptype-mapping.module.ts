import { ApplicationExceptionHandler } from "@hrexpert/backend-utils";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PayrollCodeBranchMappingController } from "./code-branch-emptype-mapping.controller";
import { PayrollCodeBranchMappingService } from "./code-branch-emptype-mapping.service";
import { PayrollCodeBranchMappingEntity } from "./entities/code-branch-emptype-mapping.entity";
import { PayrollCodeBranchMappingReposirtory } from "./repo/code-branch-emptype-mapping-repo";
import { EmployeeOnboardingService, PayrollRecordsSharedService } from "@hrexpert/shared-services";

@Module({
  imports: [
    TypeOrmModule.forFeature([PayrollCodeBranchMappingEntity])
  ],
  controllers: [PayrollCodeBranchMappingController],
  providers: [PayrollCodeBranchMappingService, PayrollCodeBranchMappingReposirtory, ApplicationExceptionHandler, EmployeeOnboardingService, PayrollRecordsSharedService],
  exports: [PayrollCodeBranchMappingReposirtory]
})
export class PayrollCodeBranchMappingModule { }