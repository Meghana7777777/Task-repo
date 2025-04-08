import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { ITransactionHelper } from './itransaction-helper';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';


export class GenericTransactionManager implements ITransactionHelper {
  constructor(private dataSource: DataSource) { }
  private queryRunner: QueryRunner;
  private transactionManager: EntityManager;


  async startTransaction(isolationLevel?: IsolationLevel) {
    // getting a connection from the connection pool;
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.startTransaction(isolationLevel ? isolationLevel : 'READ COMMITTED');
    this.transactionManager = this.queryRunner.manager;
  }

  async getQueryRunner(): Promise<EntityManager> {
    return this.queryRunner.manager;
  }

  getRepository<T>(RandomEntity: new (transactionManager: EntityManager) => T): Repository<T> {
    if (!this.transactionManager) {
      throw new Error('Requesting repository in a transaction scope without starting the transaction');
    }
    return this.transactionManager.getRepository(RandomEntity);
  }

  // getCustomRepository<T extends Repository<any>>(RandomEntity: new (dataSource: DataSource) => T): T {
  //   if (!this.transactionManager) {
  //     throw new Error('Requesting custom repository in a transaction scope without starting the transaction');
  //   }

  //   const aa: any = this.transactionManager.withRepository(this.dataSource.getRepository(RandomEntity));
  //   return aa;
  // }

  async completeTransaction() {
    try {
      await this.queryRunner.commitTransaction();
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await this.queryRunner.release();
    }
  }

  async releaseTransaction() {
    try {
      if (this.queryRunner?.isTransactionActive) {
        await this.queryRunner.rollbackTransaction();
      }
    } finally {
      if (this.queryRunner) {
        if (!this.queryRunner.isReleased) {
          await this.queryRunner.release();
        }
      }
    }
  }
}