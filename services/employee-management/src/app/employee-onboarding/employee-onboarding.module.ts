import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeLogsService, PayrollRecordsSharedService, WhatsUpService } from '@hrexpert/shared-services';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchesModule } from '../branches/branches.module';
import { EmployeeType } from '../employee-type/dto/employee-type-entity';
import { EmployeeTypeRepository } from '../employee-type/dto/employee-type-repository';
import { IdProof } from '../id-proof/dto/id-proof-entity';
import { IdProofRepository } from '../id-proof/dto/id-proof-repo';
import { QualificationsEntity } from '../qualifications/entites/qualifications.entity';
import { QualificationsRepository } from '../qualifications/repositories/qualifications.repository';
import { RelationsRepository } from '../relations/dto/relations.repo';
import { Relations } from '../relations/relations.entity';
import { CreateEmployeeAdapter } from './adapters/create-employee.adapter';
import { EmployeeOnboardingController } from './employee-onboarding.controller';
import { EmployeeOnboardingService } from './employee-onboarding.service';
import { BankDetailsEntity } from './entities/bank-details.entity';
import { EmployeeFormConfiguration } from './entities/employee-configuration.entity';
import { Employee } from './entities/employee-details.entity';
import { EmployeeEduDetails } from './entities/employee-education.entity';
import { EmployeeExperienceDetails } from './entities/employee-experience.entity';
import { EmployeeFamilyDetails } from './entities/employee-family.entity';
import { EmployeeIdProofs } from './entities/employee-idproof';
import { EmployeeResignationProofs } from './entities/employee-resignation-proofs-entity';
import { PfEsiEffDatesEntity } from './entities/pf-esi-eff-dates.entity';
import { PrefixConfiguration } from './entities/prefix-configuration.entity';
import { BankDetailsRepository } from './repositorys/bank-details-repo';
import { EmployeeFormConfigurationRepository } from './repositorys/employee-configuration.repo';
import { EmployeeDetailRepository } from './repositorys/employee-details-repo';
import { EmployeeResignRepository } from './repositorys/employee-resign-repo';
import { PfEsiEffDatesRepository } from './repositorys/pf-esi-eff-dates-repo';
import { PrefixConfigurationRepository } from './repositorys/prefix-configuration.repo';
import { MemoRepository } from '../memo/memo.repo';
import { MemoEntity } from '../memo/memo.entity';
import { SwipeProcessLogEntity } from './entities/swipe-process-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee, EmployeeEduDetails, EmployeeExperienceDetails, EmployeeFamilyDetails, EmployeeIdProofs, EmployeeFormConfiguration, PrefixConfiguration, Relations, IdProof, QualificationsEntity, EmployeeType, BankDetailsEntity, EmployeeResignationProofs, PfEsiEffDatesEntity,MemoEntity,SwipeProcessLogEntity
    ]), forwardRef(() => BranchesModule),
  ],
  controllers: [EmployeeOnboardingController],
  providers: [WhatsUpService, EmployeeDetailRepository, CreateEmployeeAdapter, EmployeeOnboardingService, ApplicationExceptionHandler, PrefixConfigurationRepository, EmployeeFormConfigurationRepository, EmployeeLogsService, RelationsRepository, IdProofRepository, QualificationsRepository, EmployeeTypeRepository, PayrollRecordsSharedService, BranchesService, BankDetailsRepository, EmployeeResignRepository, PfEsiEffDatesRepository,MemoRepository,DepartmentService,DivisionService,DesignationsService],
  exports: [EmployeeDetailRepository, EmployeeLogsService, BranchesService,DepartmentService,DivisionService,DesignationsService],
})
export class EmployeeOnboardingModule { }
