import { ApplicationExceptionHandler } from "@hrexpert/shared-models";
import { EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GenericTransactionManager } from "../../database/type-orm-transactions";
import { LeaveAllocationsModule } from "../leave-allocation/leave-allocation-module";
import { EntitlementEntity } from "./entites/entitlement-entity";
import { LeaveGroupEntity } from "../leave-group/dto/leave-group-entity";
import { LeavePolicyTypeEntity } from "./entites/leave-policy-type-entity";
import { LeaveTypeApplicabilityEntity } from "./entites/leave-type-applicability-entity";
import { LeaveTypeGroupMapping } from "./entites/leave-type-group-mapping.entity";
import { LeavePolicyController } from "./leave-policy.controller";
import { LeavePolicyService } from "./leave-policy.service";
import { EntitlementRepository } from "./repos/entitlement-repo";
import { LeavePolicyRepository } from "./repos/leave-policy-repo";
import { LeaveTypeApplicabilityRepository } from "./repos/leave-type-applicability-repo";


@Module({
    imports: [
      TypeOrmModule.forFeature([LeavePolicyTypeEntity, LeaveGroupEntity,EntitlementEntity, LeaveTypeGroupMapping, LeaveTypeApplicabilityEntity]),LeaveAllocationsModule
    ],
    controllers: [LeavePolicyController],
    providers: [LeavePolicyService, ApplicationExceptionHandler, LeavePolicyRepository, LeaveTypeApplicabilityRepository, EntitlementRepository, GenericTransactionManager, EmployeeOnboardingService]
  })
  export class LeavePolicyModule {}