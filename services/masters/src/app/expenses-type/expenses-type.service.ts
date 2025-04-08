import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExpensesTypeEntity } from "./entity/expenses-type.entity";
import { Repository } from "typeorm";
import { ExpensesTypeDto } from "./dto/expenses-type.dto";
import { CommonResponseModel } from "@hrexpert/backend-utils";

@Injectable()
export class ExpensesTypeService {
    constructor(
        @InjectRepository(ExpensesTypeEntity)
        private readonly expensessTypeRepository: Repository<ExpensesTypeEntity>
    ) { }

    async CreateExpensesType(dto: ExpensesTypeDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.expensessTypeRepository.findOne({
                where: { expenseType: dto.expenseType }
            });
            if (exists) {
                return new CommonResponseModel(false, 3, 'Already exists');
            }
            const entity = new ExpensesTypeEntity();
            entity.expenseType = dto.expenseType;
            entity.isActive = true;
            const savedEntity = await this.expensessTypeRepository.save(entity);
            return new CommonResponseModel(true, 1, 'Created Successfully', savedEntity);
        } catch (err) {
            console.error('Error in CreateExpensesType:', err);
            return new CommonResponseModel(false, 0, 'Internal server error');
        }
    }


    async getexpensesType(): Promise<CommonResponseModel> {
        const data = await this.expensessTypeRepository.find({
            where: {
                isActive: true
            }
        });
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrivved Successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No Active Expenses Type found', []);
    }

    async deactivateExpensesType(expenseId: number): Promise<CommonResponseModel> {
        try {
            const expenseType = await this.expensessTypeRepository.findOne({ where: { expenseId } });

            if (!expenseType) {
                return new CommonResponseModel(false, 0, 'Expense Type not found');
            }

            expenseType.isActive = false;
            await this.expensessTypeRepository.save(expenseType);

            return new CommonResponseModel(true, 1, 'Expense Type deactivated successfully');
        } catch (error) {
            console.error('Error deactivating expense type:', error);
            return new CommonResponseModel(false, 0, 'Failed to deactivate expense type');
        }
    }

    async updateExpensesType(expenseId: number, dto: ExpensesTypeDto): Promise<CommonResponseModel> {
        try {
            const expenseType = await this.expensessTypeRepository.findOne({ where: { expenseId } });
            if (!expenseType) {
                return new CommonResponseModel(false, 0, 'Expense Type not found');
            }
            expenseType.expenseType = dto.expenseType ?? expenseType.expenseType;
            // expenseType.isActive = dto.isActive ?? expenseType.isActive;
            const updatedExpense = await this.expensessTypeRepository.save(expenseType);
            return new CommonResponseModel(true, 1, 'Expense Type updated successfully', updatedExpense);
        } catch (error) {
            console.error('Error updating expense type:', error);
            return new CommonResponseModel(false, 0, 'Failed to update expense type');
        }
    }

}
