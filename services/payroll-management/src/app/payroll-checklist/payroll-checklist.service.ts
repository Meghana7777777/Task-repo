import { Injectable } from '@nestjs/common';
import { PayrollChecklist } from './payroll-checklist.entity';
import { PayrollChecklistRepository } from './payroll-checklist.repo';
import { CommonResponseModel } from '@hrexpert/backend-utils';

@Injectable()
export class PayrollChecklistService {
    constructor(
        private readonly payrollChecklistRepo: PayrollChecklistRepository,
    ) { }

    async create(data: Partial<PayrollChecklist>): Promise<PayrollChecklist> {
        const newChecklist = this.payrollChecklistRepo.create(data);
        return await this.payrollChecklistRepo.save(newChecklist);
    }

    async findAll(): Promise<PayrollChecklist[]> {
        return await this.payrollChecklistRepo.find();
    }

    async findOne(id: number): Promise<PayrollChecklist | null> {
        return await this.payrollChecklistRepo.findOne({ where: { id } });
    }

    async update(id: number, data: Partial<PayrollChecklist>): Promise<PayrollChecklist | null> {
        await this.payrollChecklistRepo.update(id, data);
        return this.findOne(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.payrollChecklistRepo.delete(id);
        return result.affected > 0;
    }

    async saveOrUpdateChecklist(data: any): Promise<CommonResponseModel> {
        try {
            const { branchId, payrollMonth } = data;

            // Check if record exists for the branch and month
            let checklist = await this.payrollChecklistRepo.findOne({ where: { branchId, payrollMonth } });

            if (checklist) {
                // 🛠 Update existing record
                await this.payrollChecklistRepo.update(checklist.id, {
                    ...data,
                    updatedAt: new Date(),
                });
                return new CommonResponseModel(true, 1, 'Payroll checklist updated successfully.');
            } else {
                // 🆕 Create new record
                const newChecklist = this.payrollChecklistRepo.create(data);
                await this.payrollChecklistRepo.save(newChecklist);
                return new CommonResponseModel(true, 1, 'Payroll checklist saved successfully.');
            }
        } catch (error) {
            console.error('Error saving payroll checklist:', error);
            return new CommonResponseModel(false, 0, 'An error occurred while saving payroll checklist.', error);
        }
    }

    async getChecklist(req: any): Promise<CommonResponseModel> {
        try {
            const checklist = await this.payrollChecklistRepo.findOne({ where: { branchId: req.branchId, payrollMonth: req.payrollMonth } });
            return new CommonResponseModel(true, 1, 'fetched', checklist)
        } catch (error) {
            console.error('Error fetching payroll checklist:', error);
            return new CommonResponseModel(false, 0, 'Failed to fetch payroll checklist.');
        }
    }

}
