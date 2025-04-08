import { CommonResponseModel } from '@hrexpert/backend-utils';
import { TypeEnum } from '@hrexpert/shared-models';
import { EmployeeTypeService } from '@hrexpert/shared-services';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PayrollRecordsService } from '../payroll-records/payroll-records.service';
import { PayrollTypesComponentsEntity } from './entites/payroll-types-components.entity';
import { PayrollCodeRepository } from './repositories/payroll-code.repository';
import { PayrollComponentsRepository } from './repositories/payroll-components.repository';
import { PayrollTypeComponentsRepository } from './repositories/payroll-types-components.repository';
import { PayrollCodeBranchMappingReposirtory } from '../code-branch-emptype-mapping/repo/code-branch-emptype-mapping-repo';

@Injectable()
export class PayrollComponentsService {
    constructor(
        private payrollComponentsRepository: PayrollComponentsRepository,
        private payrollTypeComponentsRepository: PayrollTypeComponentsRepository,
        private payrollRecordsService: PayrollRecordsService,
        private EmployeeTypeService: EmployeeTypeService,
        private payrollCodeRepo: PayrollCodeRepository,
        private payrollCodeBranchMapRepo: PayrollCodeBranchMappingReposirtory
    ) { }

    async getAllPayrollComponents(): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollComponentsRepository.getAllPayrollComponentsRepo()
            if (result) {
                return new CommonResponseModel(true, 1, "Data Retrived", result)
            }
            else {
                return new CommonResponseModel(false, 0, "No Data Found")
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, err)
        }
    }

    async getAllPayrollComponentsEmployeeAganist(req:any): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollComponentsRepository.getAllPayrollComponentsEmployeeAganistRepo(req)
            if (result) {
                return new CommonResponseModel(true, 1, "Data Retrived", result)
            }
            else {
                return new CommonResponseModel(false, 0, "No Data Found")
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, err)
        }
    }


    async getPayrollComponentsByBranch(req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollComponentsRepository.getAllPayrollComponentsByBranch(req)
            if (result) {
                return new CommonResponseModel(true, 1, "Data Retrived", result)
            }
            else {
                return new CommonResponseModel(false, 0, "No Data Found")
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, err)
        }
    }
    async getAllPayrollCodesData(): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollComponentsRepository.getAllPayrollCodesDataRepo()
            if (result) {
                return new CommonResponseModel(true, 1, "Data Retrived", result)
            }
            else {
                return new CommonResponseModel(false, 0, "No Data Found")
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, err)
        }
    }

    async payrollComponentsByCode(req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollComponentsRepository.find({ where: { payrollCode: req.payrollCode } })
            if (result) {
                return new CommonResponseModel(true, 1, "Data Retrived", result)
            }
            else {
                return new CommonResponseModel(false, 0, "No Data Found")
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, err)
        }
    }

    async getAllEmpTypeFromEmployee(): Promise<any> {
        try {
            const result = await this.EmployeeTypeService.getAllEmployeeTypes()
            if (result) {
                return new CommonResponseModel(true, 1, "Data Retrived", result.data)
            }
            else {
                return new CommonResponseModel(false, 0, "No Data Found")
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, err)
        }
    }

    async createPayrollTypeComponents(req: any): Promise<CommonResponseModel> {
        try {
            const entities = req.map((item) => {
                const entity = new PayrollTypesComponentsEntity();
                entity.payRollTypes = item.payrollTypeId;
                entity.payRollComponent = item.payrollComponentId;
                return entity;
            });
            const result = await this.payrollTypeComponentsRepository.save(entities);

            if (result && result.length > 0) {
                return new CommonResponseModel(true, 1, "Data Saved Successfully", result);
            } else {
                return new CommonResponseModel(false, 0, "No Data Found");
            }
        } catch (err) {
            console.error(err);
            return new CommonResponseModel(false, 0, "Error Occurred", err);
        }
    }

    async getAllPayrollNonRecurringComponents(): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollComponentsRepository.find({ where: { type: TypeEnum.NONRECURRING } })
            if (result) {
                return new CommonResponseModel(true, 1, "Data Retrived", result)
            }
            else {
                return new CommonResponseModel(false, 0, "No Data Found")
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, err)
        }
    }

    async createPayrollComponents(req: any): Promise<CommonResponseModel> {
        try {
            const savedEntities = [];

            for (const data of req.leaveTypeData) {
                let existingRecord = null;
                if (data.id) {
                    existingRecord = await this.payrollComponentsRepository.findOne({ where: { id: data.id } });
                }
                const convertToBooleanOrNull = (value) => {
                    return value === undefined || value === null || value === "" ? null : Boolean(Number(value));
                };
                const payrollData = {
                    componentName: data.componentName,
                    columnName: data.columnName || data.componentName || null,
                    columnOrder: data.columnOrder ?? null,
                    isDerived: convertToBooleanOrNull(data.isDerived),
                    derivedRule: data.derivedRule || null,
                    cutoffAmount: data.cutoffAmount || null,
                    roundStrg: data.roundStrg || null,
                    calculatedRule: data.calculatedRule || null,
                    effDate: data.effDate ?? null,
                    type: data.type || null,
                    componentType: data.componentType || null,
                    isPfEarning: convertToBooleanOrNull(data.isPfEarning),
                    isEsiEarning: convertToBooleanOrNull(data.isEsiEarning),
                    employeeTypeId: data.employeeTypeId ? Number(data.employeeTypeId) : null,
                    isGrossDerived: convertToBooleanOrNull(data.isGrossDerived),
                    payrollCode: req.leaveGroupCode,
                    payrollType: req.payrollType,
                    state: req.state,
                };

                if (existingRecord) {
                    await this.payrollComponentsRepository.update(data.id, payrollData);
                    const updatedRecord = await this.payrollComponentsRepository.findOne({ where: { id: data.id } });
                    savedEntities.push(updatedRecord);
                } else {
                    const newEntity = this.payrollComponentsRepository.create(payrollData);
                    const result = await this.payrollComponentsRepository.save(newEntity);
                    savedEntities.push(result);
                }
            }
            if (savedEntities.length > 0) {
                await this.payrollRecordsService.updateAutomaticallyValue({ employeeTypeId: savedEntities[0].employeeTypeId });
                return new CommonResponseModel(true, 1, "Data Saved Successfully", savedEntities);
            } else {
                return new CommonResponseModel(false, 0, "No Data Found");
            }
        } catch (err) {
            console.error("Error Occurred Payroll Components Saving:", err);
            return new CommonResponseModel(false, 0, "Error Occurred");
        }
    }

    async updatePayrollComponents(req: any): Promise<CommonResponseModel> {
        try {
            let isDerived;
            if (req.isDerived === "Yes") {
                isDerived = 1;
            } else if (req.isDerived === "No") {
                isDerived = 0;
            } else {
                isDerived = '-';
            }
            let isPfEarning;
            if (req.isPfEarning === "Yes") {
                isPfEarning = 1;
            } else if (req.isPfEarning === "No") {
                isPfEarning = 0;
            } else {
                isPfEarning = '-';
            }
            let isEsiEarning;
            if (req.isEsiEarning === "Yes") {
                isEsiEarning = 1;
            } else if (req.isEsiEarning === "No") {
                isEsiEarning = 0;
            } else {
                isEsiEarning = '-';
            }
            let isGrossDerived;
            if (req.isGrossDerived === "Yes") {
                isGrossDerived = 1;
            } else if (req.isGrossDerived === "No") {
                isGrossDerived = 0;
            } else {
                isGrossDerived = '-';
            }
            const formattedEffDate = moment(req.effDate).format('DD-MM-YYYY');
            const update = await this.payrollComponentsRepository.update({ id: req.id }, {
                componentName: req.componentName, columnName: req.columnName,
                columnOrder: req.columnOrder, isDerived: !!isDerived, derivedRule: req.derivedRule, cutoffAmount: req.cutoffAmount, roundStrg: req.roundStrg, calculatedRule: req.calculatedRule, effDate: moment(req.effDate).format('DD-MM-YYYY'), type: req.type, componentType: req.componentType, isPfEarning: !!isPfEarning, isEsiEarning: !!isEsiEarning, isGrossDerived: !!isGrossDerived
            })
            if (update.affected > 0) {
                const data = await this.payrollComponentsRepository.findOne({ where: { id: req.id } })
                // await this.payrollRecordsService.generateEmpPayrollRecords()
                await this.payrollRecordsService.updateAutomaticallyValue({ employeeTypeId: data.employeeTypeId })
                return new CommonResponseModel(true, 1, 'Updated successfully', update);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            return new CommonResponseModel(false, 0, error)
        }
    }

    async activateDeactivatePayrollComponents(req: any): Promise<CommonResponseModel> {
        try {
            const exists = await this.payrollComponentsRepository.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 0, 'No Payroll Type Found');
            }
            const update = await this.payrollComponentsRepository.update(
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
            return new CommonResponseModel(false, 0, err)
        }
    }

    async getPayrollComponentsByOrder(): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollComponentsRepository.find({ order: { columnOrder: 'ASC' } });
            if (result) {
                return new CommonResponseModel(true, 1, 'Data Retrieved', result);
            } else {
                return new CommonResponseModel(false, 0, 'No Data Found');
            }
        } catch (error) {
            return new CommonResponseModel(false, 0, error)
        }
    }

    async updateEmployeeTypeInPayrollComponents(req: any): Promise<CommonResponseModel> {
        console.log(req, 'RRRRRRRRRRRR')
        const existing = await this.payrollCodeBranchMapRepo.findOne({ where: { branchId: req.branchId, employeeTypeId: req.employeeTypeId } });
        if (existing) {
            return new CommonResponseModel(false, 0, 'Branch and Employee Type already mapped to a payroll');
        }
        const findReq = await this.payrollCodeRepo.find({ where: { payrollCode: req.payrollCode } })
        const savedEntities = [];
        for (const data of findReq) {
            const convertToBooleanOrNull = (value) => {
                return value === undefined || value === null || value === "" ? null : Boolean(Number(value));
            };
            const payrollData = {
                componentName: data.componentName,
                columnName: data.columnName || data.componentName || null,
                columnOrder: data.columnOrder ?? null,
                isDerived: convertToBooleanOrNull(data.isDerived),
                derivedRule: data.derivedRule || null,
                cutoffAmount: data.cutoffAmount || null,
                roundStrg: data.roundStrg || null,
                calculatedRule: data.calculatedRule || null,
                effDate: data.effDate ?? null,
                type: data.type || null,
                componentType: data.componentType || null,
                isPfEarning: convertToBooleanOrNull(data.isPfEarning),
                isEsiEarning: convertToBooleanOrNull(data.isEsiEarning),
                isGrossDerived: convertToBooleanOrNull(data.isGrossDerived),
                payrollCode: data.payrollCode,
                payrollType: data.payrollType,
                state: data.state,
                employeeTypeId: req.employeeTypeId ? Number(req.employeeTypeId) : null,
                branchId: req.branchId ? Number(req.branchId) : null,
            };
            const newEntity = this.payrollComponentsRepository.create(payrollData);
            const result = await this.payrollComponentsRepository.save(newEntity);
            savedEntities.push(result);
        }
        if (savedEntities.length > 0) {
            await this.payrollRecordsService.updateAutomaticallyValue({ employeeTypeId: savedEntities[0].employeeTypeId, branchId: savedEntities[0].branchId });
            return new CommonResponseModel(true, 1, "Data Saved Successfully", savedEntities);
        } else {
            return new CommonResponseModel(false, 0, "No Data Found");
        }
    }

    async createPayrollCode(req: any): Promise<CommonResponseModel> {
        try {
            const savedEntities = [];
            for (const data of req.payrollData) {
                const convertToBooleanOrNull = (value) => {
                    return value === undefined || value === null || value === "" ? null : Boolean(Number(value));
                };
                const payrollData = {
                    componentName: data.componentName,
                    columnName: data.columnName || data.componentName || null,
                    columnOrder: data.columnOrder ?? null,
                    isDerived: convertToBooleanOrNull(data.isDerived),
                    derivedRule: data.derivedRule || null,
                    cutoffAmount: data.cutoffAmount || null,
                    roundStrg: data.roundStrg || null,
                    calculatedRule: data.calculatedRule || null,
                    effDate: data.effDate ?? null,
                    type: data.type || null,
                    componentType: data.componentType || null,
                    isPfEarning: convertToBooleanOrNull(data.isPfEarning),
                    isEsiEarning: convertToBooleanOrNull(data.isEsiEarning),
                    isGrossDerived: convertToBooleanOrNull(data.isGrossDerived),
                    payrollCode: req.payrollGroupCode,
                    payrollType: req.payrollType,
                    state: req.state,
                };
                const newEntity = this.payrollCodeRepo.create(payrollData);
                const result = await this.payrollCodeRepo.save(newEntity);
                savedEntities.push(result);
            }
            if (savedEntities.length > 0) {
                // await this.payrollRecordsService.updateAutomaticallyValue({ employeeTypeId: savedEntities[0].employeeTypeId });
                return new CommonResponseModel(true, 1, "Data Saved Successfully", savedEntities);
            } else {
                return new CommonResponseModel(false, 0, "No Data Found");
            }
        } catch (err) {
            console.error("Error Occurred Payroll Code Saving:", err);
            return new CommonResponseModel(false, 0, "Error Occurred");
        }
    }
    
    async codeDefinedByPayrollGroup(req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollCodeRepo.find({ where: { payrollType: req.payrollType } })
            if (result) {
                return new CommonResponseModel(true, 1, "Data Retrived", result)
            }
            else {
                return new CommonResponseModel(false, 0, "No Data Found")
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, err)
        }
    }


}
