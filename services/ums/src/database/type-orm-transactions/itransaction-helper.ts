import { Repository } from 'typeorm';


export interface ITransactionHelper {
    startTransaction(): void;
    completeTransaction(work: () => void): Promise<void>;
    getRepository<T>(RandomEntity: new (transactionManager: any) => T): Repository<T>;
    // getCustomRepository<T extends Repository<any>>(RandomEntity: new (transactionManager: any) => T): T;
}
