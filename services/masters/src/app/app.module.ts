import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShiftsModule } from './shifts/shifts.module';
import { TypesOfLeavesModule } from './types-of-leaves/types-of-leave.module';
import { SkillsModule } from './skills/skills.module';
import { WeekOffLeavesModule } from './week-off-leaves/week-of-leaves.module';
import { OverTimeModule } from './apply-ot/apply-ot-module';
import { AttendanceDevMOdule } from './attendance-device/attendance-device.module';
import { EmployeeOnboardingModule } from './../../../employee-management/src/app/employee-onboarding/employee-onboarding.module'
import { DepartmentsModule } from './../../../employee-management/src/app/departments/departments.module'
import { DesignationsModule } from './../../../employee-management/src/app/designations/designations.module'
import { BranchesModule } from './../../../employee-management/src/app/branches/branches.module'
import { DivisionModule } from './../../../employee-management/src/app/division/division.module'
import { BranchesMappingModule } from './branches-mapping/branches-mapping-module';
import { ReasonsTypeModule } from './reasons-type/reasons-type-module'
import { DocumentModule } from './knowledge-repository/knowledge-repository.module';
import { FileHandlingModule } from './knowledge-repository/file-upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ExpensesTypeMOdule } from './expenses-type/expenses-type.module';
import { ExpensesAgainstMOdule } from './expenses-against/expenses-against.module';
import { DomainMOdule } from './domain/domain.module';
import { DocumentTypeMOdule } from './document-type/document-type.module';
import { AssetMOdule } from './asset-mapping/asset-mapping.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'kr_upload_images'),//kr_upload_images
      serveRoot: '/kr_upload_images',
      serveStaticOptions: {
        redirect: false,
        index: false
      }
    }),
    DatabaseModule,
    ShiftsModule,
    TypesOfLeavesModule,
    DocumentModule,
    FileHandlingModule,
    DepartmentsModule,
    DesignationsModule,
    BranchesModule,
    ExpensesAgainstMOdule,
    DomainMOdule,
    DocumentTypeMOdule,
    AssetMOdule,
    DivisionModule,
    ExpensesTypeMOdule,
    SkillsModule,
    EmployeeOnboardingModule,
    WeekOffLeavesModule,
    OverTimeModule,
    AttendanceDevMOdule,
    BranchesMappingModule,
    ReasonsTypeModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
