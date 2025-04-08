import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesFileService } from './expenses-file.service';
import { ExpensesFileController } from './expenses-file.controller';
import { ExpensesFileEntity } from './entity/expenses-file.entity';
import { ExpensesFileLogEntity } from './entity/expenses-file-log.entity';
import { ExpensesFileRepository } from './repo/expenses-file.repository';
import { ExpensesFileLogRepository } from './repo/expenses-file-log.repository';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  imports: [TypeOrmModule.forFeature([ExpensesFileEntity, ExpensesFileLogEntity])],
  controllers: [ExpensesFileController],
  providers: [ExpensesFileService, ExpensesFileRepository, ExpensesFileLogRepository, ApplicationExceptionHandler],
  exports: [ExpensesFileService],
})
export class ExpensesFileModule { }
