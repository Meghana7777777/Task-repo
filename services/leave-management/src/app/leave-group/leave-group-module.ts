import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models'
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { LeaveGroupsRepository } from './leave-groups.repo';
import { LeaveGroupEntity } from './dto/leave-group-entity';
import { LeaveGroupsController } from './leave-group-controller';
import { LeaveGroupsService } from './leave-group-service';
@Module({
  imports:[TypeOrmModule.forFeature([LeaveGroupEntity]),],
  controllers: [LeaveGroupsController],
  providers: [LeaveGroupsService,LeaveGroupsRepository, ApplicationExceptionHandler,EmployeeOnboardingService]
})
export class LeaveGroupModule {}
