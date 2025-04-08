import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LeaveTypeMasterEntity } from "./entities/leave-type.entity";
import { LeaveTypeController } from "./leave-type-master.controller";
import { ApplicationExceptionHandler } from "@hrexpert/backend-utils";
import { LeaveTypeService } from "./leave-type-master.service";
import { LeaveGroupMasterEntity } from "./entities/leave-group-master.entity";
import { BranchGroupMapEntity } from "./entities/branch-group-map.entity";
import { LeaveMasterEntity } from "./entities/leave-master.entity";
import { LeaveCodeDefineEntity } from "./entities/leave-code-define.entity";
import { LeaveGeneratedCodeEntity } from "./entities/leave-generated-code.entiy";
import { LeaveGroupCodeMappingEntity } from "./entities/leave-group-code-map.entity";
import { Employee } from "services/employee-management/src/app/employee-onboarding/entities/employee-details.entity";
import { LeaveBalance } from "../leave-balance-new/entities/leaves-balance.entity";
import { NewLeaveAllocationsEntity } from "./entities/new-leave-allocations-entity";

@Module({
    imports: [
      TypeOrmModule.forFeature([LeaveTypeMasterEntity,LeaveGroupMasterEntity,BranchGroupMapEntity,LeaveMasterEntity,LeaveCodeDefineEntity,LeaveGeneratedCodeEntity,LeaveGroupCodeMappingEntity,Employee,LeaveBalance, NewLeaveAllocationsEntity])
    ],
    controllers: [LeaveTypeController],
    providers: [LeaveTypeService,ApplicationExceptionHandler]
  })
  export class LeaveTypeModule {}