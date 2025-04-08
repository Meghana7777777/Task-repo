import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpensesFileEntity } from '../entity/expenses-file.entity';

@Injectable()
export class ExpensesFileRepository extends Repository<ExpensesFileEntity> {
  constructor(private dataSource: DataSource) {
    super(ExpensesFileEntity, dataSource.createEntityManager());
  }
}
