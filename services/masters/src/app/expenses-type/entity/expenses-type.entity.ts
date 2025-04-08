import { AbstractEntity } from "services/masters/src/database/common-entities";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('expenses_type')
export class ExpensesTypeEntity {

    @PrimaryGeneratedColumn('increment', { name: 'expense_id' })
    expenseId: number;

    @Column('varchar', { length: 50, nullable: false, name: 'expense_type' })
    expenseType: string;

    @Column('boolean', { nullable: false, name: 'is_active' })
    isActive: boolean;
}
