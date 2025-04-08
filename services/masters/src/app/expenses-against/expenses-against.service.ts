import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommonResponseModel } from "@hrexpert/backend-utils";
import { ExpensesAgainstEntity } from "./entity/expenses-against.entity";
import { ExpensesAgainstDto } from "./dto/expenses-against.dto";

@Injectable()
export class ExpensesAgainstService {
    constructor(
        @InjectRepository(ExpensesAgainstEntity)
        private readonly expensessAgainstRepository: Repository<ExpensesAgainstEntity>
    ) { }

    async createExpensesAgainst(dto: ExpensesAgainstDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.expensessAgainstRepository.findOne({
                where: { expenseAgainst: dto.expenseAgainst }
            });
            if (exists) {
                return new CommonResponseModel(false, 3, 'Already exists');
            }
            const entity = new ExpensesAgainstEntity();
            entity.expenseAgainst = dto.expenseAgainst;
            entity.isActive = true;
            const savedEntity = await this.expensessAgainstRepository.save(entity);
            return new CommonResponseModel(true, 1, 'Created Successfully', savedEntity);
        } catch (err) {
            console.error('Error in CreateExpensesType:', err);
            return new CommonResponseModel(false, 0, 'Internal server error');
        }
    }


    async getExpensesAgainst(): Promise<CommonResponseModel> {
        const data = await this.expensessAgainstRepository.find({
            where: {
                isActive: true
            }
        });
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrivved Successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No Active Expenses Type found', []);
    }

    async deactivateExpensesAgainst(expenseAgainstId: number): Promise<CommonResponseModel> {
        try {
            const expenseAgainst = await this.expensessAgainstRepository.findOne({ where: { expenseAgainstId } });
            if (!expenseAgainst) {
                return new CommonResponseModel(false, 0, 'Expense Against not found');
            }
            expenseAgainst.isActive = false;
            await this.expensessAgainstRepository.save(expenseAgainst);
            return new CommonResponseModel(true, 1, 'Expense Against deactivated successfully');
        } catch (error) {
            console.error('Error deactivating expense type:', error);
            return new CommonResponseModel(false, 0, 'Failed to deactivate expense type');
        }
    }

    async updateExpensesAgainst(expenseAgainstId: number, dto: ExpensesAgainstDto): Promise<CommonResponseModel> {
        try {
            const expenseAgainst = await this.expensessAgainstRepository.findOne({ where: { expenseAgainstId } });
            if (!expenseAgainst) {
                return new CommonResponseModel(false, 0, 'Expense Against not found');
            }
            expenseAgainst.expenseAgainst = dto.expenseAgainst ?? expenseAgainst.expenseAgainst;
            const updatedExpense = await this.expensessAgainstRepository.save(expenseAgainst);
            return new CommonResponseModel(true, 1, 'Expense Against updated successfully', updatedExpense);
        } catch (error) {
            return new CommonResponseModel(false, 0, 'Failed to update expense type');
        }
    }

}
