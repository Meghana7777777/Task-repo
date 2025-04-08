import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('expenses_against')
export class ExpensesAgainstEntity {

    @PrimaryGeneratedColumn('increment', { name: 'expenses_against_id' })
    expenseAgainstId: number;

    @Column('varchar', { length: 50, nullable: false, name: 'expense_against' })
    expenseAgainst: string;

    @Column('boolean', { nullable: false, name: 'is_active' })
    isActive: boolean;
}
