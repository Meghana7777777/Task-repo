import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { ExpensesEntity } from './entity/expenses.entity';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { ExpensesFileEntity } from './entity/expenses-file.entity';
import { ExpensesFileRepository } from './repo/expenses-file.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ExpensesEntity, ExpensesFileEntity])],
  controllers: [ExpensesController],
  providers: [ExpensesService, ApplicationExceptionHandler, ExpensesFileRepository],
})
export class ExpensesModule { }
