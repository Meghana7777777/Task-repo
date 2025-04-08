import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExpensesFileLogEntity } from '../entity/expenses-file-log.entity';

@Injectable()
export class ExpensesFileLogRepository extends Repository<ExpensesFileLogEntity> {
  constructor(private dataSource: DataSource) {
    super(ExpensesFileLogEntity, dataSource.createEntityManager());
  }
}
