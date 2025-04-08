import { CommonResponseModel } from '@hrexpert/backend-utils';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PayrollTypesEntity } from './entites/payroll-types.entity';
import { PayrollTypesRepository } from './repositories/payroll-types.repository';

@Injectable()
export class PayrollTypesService {
    constructor(
        private payrollTypesRepository: PayrollTypesRepository,
        private dataSource: DataSource
    ) { }

    async createPayrollTypes(req: any): Promise<CommonResponseModel> {
        try {
            const entity = new PayrollTypesEntity();
            entity.name = req.name
            entity.description = req.description
            const result = await this.payrollTypesRepository.save(entity)
            if (result) {
                return new CommonResponseModel(true, 1, "Payroll Types Created", result)
            }
            else {
                return new CommonResponseModel(false, 0, "Failed Payroll Types Creation")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getAllPayrollTypes(): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollTypesRepository.getAllPayrollTypesRepo()
            if (result) {
                return new CommonResponseModel(true, 1, "Data Retrived", result)
            }
            else {
                return new CommonResponseModel(false, 0, "No Data Found")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async updatePayrollTypes(req: any): Promise<CommonResponseModel> {
        try {
            const update = await this.payrollTypesRepository.update({ id: req.id }, { name: req.name, description: req.description })
            if (update.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully', update);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async activateDeactivatePayrollTypes(req: any): Promise<CommonResponseModel> {
        try {
            const exists = await this.payrollTypesRepository.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 0, 'No Payroll Type Found');
            }
            const update = await this.payrollTypesRepository.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );
            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Deactivated SuccessFully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Already Deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Activated SuccessFully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Already Activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were Made');
            }
        } catch (err) {
            return err;
        }
    }

    async getAllActivePayrollTypes(): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollTypesRepository.find({ where: { isActive: true } })
            if (result) {
                return new CommonResponseModel(true, 1, "Data Retrived", result)
            }
            else {
                return new CommonResponseModel(false, 0, "No Data Found")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getActivePayrollTypes(): Promise<CommonResponseModel> {
        try {
            const data = await this.payrollTypesRepository.getActivePayrollTypesRepo()
            return data.length > 0
                ? new CommonResponseModel(true, 1, 'Data retrieved successfully', data)
                : new CommonResponseModel(false, 0, 'No data found', [])
        } catch (err) {
            throw (err)
        }
    }

}
