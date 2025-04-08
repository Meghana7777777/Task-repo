import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeOnboardingModule } from './employee-onboarding/employee-onboarding.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DatabaseModule } from '../database/database.module';
import { EmployeeLogsModule } from './employee-logs/employee-logs.module';
import { BranchesModule } from './branches/branches.module';
import { DepartmentsModule } from './departments/departments.module';
import { DesignationsModule } from './designations/designations.module';
import { DivisionModule } from './division/division.module';
import { EmplolyeeTypeModule } from './employee-type/employee-type-module';
import { IdProofModule } from './id-proof/id-proof-module';
import { QualificationsModule } from './qualifications/qualifications.module';
import { RelationsModule } from './relations/relations.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TourIntimationModule } from './employee-forms/tour-intimation/tour-intimation-module';
import { EmployeeTicketsModule } from './tickets/employee-tickets-module';
import { JobsModule } from './jobs/jobs.module';
import { JobsRateModule } from './job-rates/jobs-rate.module';
import { MemoModule } from './memo/memo.module';
import { CompanyModule } from './company/company.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ExpensesFileModule } from './expenses/expenses-file.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { PerformanceManagementModule } from './performance-management/performance-management.module';
import { EmpAssetMappingModule } from './emp-asset-mapping/emp-asset-mapping.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: './.env',
    load: [configuration],
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../../../', 'uploaded_images'),
    serveRoot: '/images',
    serveStaticOptions: {
      redirect: false,
      index: false
    }
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../../../', 'employee-directory/id-proofs'),
    serveRoot: '/idProofs',
    serveStaticOptions: {
      redirect: false,
      index: false
    }
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../../../', 'employee-directory/resignation-proofs'),
    serveRoot: '/resignationProofs',
    serveStaticOptions: {
      redirect: false,
      index: false
    }
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../../../', 'expenses_upload_files'),
    serveRoot: '/expenses_upload_files',
    serveStaticOptions: {
      redirect: false,
      index: false
    }
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../../../', 'employee-directory/tour-claim-pdfs'),
    serveRoot: '/tour-claim-pdfs',
    serveStaticOptions: {
      redirect: false,
      index: false
    }
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../../../', 'employee-directory/experience-proofs'),
    serveRoot: '/experienceProofs',
    serveStaticOptions: {
      redirect: false,
      index: false
    }
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../../../', 'employee-directory/recruitment-resumes'),
    serveRoot: '/recruitmentResumes',
    serveStaticOptions: {
      redirect: false,
      index: false
    }
  }),
    DatabaseModule,
    EmployeeOnboardingModule,
    EmployeeLogsModule,
    ExpensesModule,
    ExpensesFileModule,
    EmpAssetMappingModule,
    BranchesModule, DepartmentsModule, DesignationsModule, DivisionModule, EmplolyeeTypeModule, IdProofModule, QualificationsModule, RelationsModule, TourIntimationModule, EmployeeTicketsModule, JobsModule, JobsRateModule, MemoModule, CompanyModule, RecruitmentModule, PerformanceManagementModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
