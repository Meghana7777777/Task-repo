import { ActionTypeEnum, CommonResponseModel, EmployeeCodeReq, EmpRecCompColumns, MessExtraDaysColumns } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/type-orm-transactions/generic-transaction-manager';
import { PayrollComponentsRepository } from '../payroll-components/repositories/payroll-components.repository';
import { EmpNonRecComponentsEntity } from '../payroll-records/entites/emp-non-rec-components.entity';
import { EmpNonRecTermsEntity } from '../payroll-records/entites/emp-non-rec-terms.entity';
import { EmpRecComponentsDto } from './dto/emp-rec-components.dto';
import { EmpRecComponentsEntity } from './entities/emp-ec-components-entities';
import { EmpRecComRepository } from './entities/emp-rec-components.repo';
import { EmployeeOnboardingService, PayrollRecordsSharedService } from '@hrexpert/shared-services';
import { EmployeeNonRecurringComponentsRepository } from '../payroll-records/repositories/emp-non-rec-components.repo';
import { EmployeeNonRecurringTermsRepository } from '../payroll-records/repositories/emp-non-rec-terms.repo';
import { EmployeeNonRecurringLogsRepository } from '../payroll-records/repositories/emp-non-rec-terms-logs.repo';
import { NonRecTermsLogsEntity } from '../payroll-records/entites/emp-non-rec-terms-logs.entity';
import moment from 'moment';

@Injectable()
export class EmpRecComService {
    constructor(
        private dataSource: DataSource,
        private readonly empRecComRepository: EmpRecComRepository,
        private payrollRecordsService: PayrollRecordsSharedService,
        private empNonRecComponentsRepo: EmployeeNonRecurringComponentsRepository,
        private empNonRecurringTermsRepo: EmployeeNonRecurringTermsRepository,
        private payrollComponentsSharedService: PayrollComponentsRepository,
        private employeeNonRecurringLogsRepository: EmployeeNonRecurringLogsRepository,
        private employeeOnboardingService: EmployeeOnboardingService,
    ) { }

    async uploadEmpRecComponent(reqData: any): Promise<CommonResponseModel> {

        const transactionManager = new GenericTransactionManager(this.dataSource);
        const columnMapping = {
            "Employee Id": "employee_id",
            "Component Id": "component_id",
            "Amount ": "amount",
        };
        try {
            await transactionManager.startTransaction();
            const flag = new Set<boolean>();
            const updatedArray = reqData.formData.map((obj) => {
                const updatedObj = {};
                for (const key in obj) {
                    const mappedKey = columnMapping[key] || key;
                    if (mappedKey) {
                        updatedObj[mappedKey] = obj[key];
                    }
                }
                return updatedObj;
            });

            const difference = Object.keys(columnMapping).filter((element) => !EmpRecCompColumns.includes(columnMapping[element]));
            if (difference.length > 0) {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 1110, "Excel columns don't match. Please attach the correct file.");
            }

            const convertedData = updatedArray.map((obj) => {
                const updatedObj = {};
                for (const key in obj) {
                    const value = obj[key];
                    updatedObj[key] = value === "" ? null : value;
                }
                return updatedObj;
            });

            for (const data of convertedData) {
                if (data) {
                    let addSave
                    const addObj = new EmpNonRecComponentsEntity();
                    addObj.emiAmount = data['amount'];
                    addObj.totalAmount = data['amount'];
                    addObj.startDate = reqData.startDate;
                    addObj.endDate = reqData.startDate;
                    addObj.employeeId = data.employeeId;
                    addObj.componentId = data.componentId;
                    addObj.emiCount = 1;
                    addObj.isPermanent = 0;
                    const findEmpId = await transactionManager.getRepository(EmpNonRecComponentsEntity).find({ where: { employeeId: data.employeeId, componentId: data.componentId, startDate: reqData.startDate } });
                    if (findEmpId.length > 0) {
                        addSave = await transactionManager.getRepository(EmpNonRecComponentsEntity).update({ employeeId: data.employeeId, componentId: data.componentId, startDate: reqData.startDate }, { emiAmount: data['amount'], totalAmount: data['amount'] })
                    } else {
                        addSave = await transactionManager.getRepository(EmpNonRecComponentsEntity).save(addObj);
                    }
                    if (!addSave) {
                        flag.add(false);
                        await transactionManager.releaseTransaction();
                        break;
                    }
                }
            }

            if (!flag.has(false)) {
                await transactionManager.completeTransaction();
                return new CommonResponseModel(true, 1, 'Data saved successfully');
            } else {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 0, 'Something went wrong');
            }
        } catch (err) {
            console.log(err);
            await transactionManager.releaseTransaction();
            return new CommonResponseModel(false, 0, 'Something went wrong');
        }
    }

    async createEmpRecComponent(request: EmpRecComponentsDto[]): Promise<CommonResponseModel> {
        // const transactionalManager = new GenericTransactionManager(this.dataSource);
        // await transactionalManager.startTransaction();
        const data = await this.payrollComponentsSharedService.getAllPayrollComponentsRepo()

        const matchingComponent = data.find((component) => component.id === request[0].componentId);
        try {
            for (const req of request) {
                if (matchingComponent.componentType === "EARNING" || matchingComponent.componentType === "DEDUCTION") {
                    const recEntity = new EmpRecComponentsEntity();
                    recEntity.amount = req.amount;
                    recEntity.componentId = req.componentId;
                    recEntity.employeeId = req.employeeId;
                    recEntity.isActive = req.isActive;
                    recEntity.createdUser = req.createdUser;
                    recEntity.updatedUser = req.updatedUser;
                    recEntity.versionFlag = req.versionFlag;
                    const record = await this.empRecComRepository.find({ where: { employeeId: req.employeeId, componentId: req.componentId } });
                    if (record.length === 0) {
                        const recSave = await this.empRecComRepository.save(recEntity);
                    } else {
                        await this.empRecComRepository.update({ employeeId: req.employeeId, componentId: req.componentId }, { amount: req.amount });
                    }
                    await this.payrollRecordsService.generateEmpPayrollRecordsByEmpId({ employeeId: req.employeeId });
                }
            }
            // await this.payrollRecordsService.generateEmpPayrollRecords();
            // await transactionalManager.completeTransaction();
            return new CommonResponseModel(true, 1, "Employee Records Saved");
        } catch (err) {
            return new CommonResponseModel(false, 0, "Something went wrong");
            // await transactionalManager.releaseTransaction();
        }
    }



    async createEmpNonRecComponent(request: EmpRecComponentsDto[]): Promise<CommonResponseModel> {
        // const transactionalManager = new GenericTransactionManager(this.dataSource);
        // await transactionalManager.startTransaction();
        let employees = []
        const data = await this.payrollComponentsSharedService.getAllPayrollComponentsRepo()

        const matchingComponent = data.find((component) => component.id === request[0].componentId);
        try {
            for (const req of request) {
                if (req.isPermanent === 'No') {
                    const record = await this.empNonRecComponentsRepo.find({ where: { employeeId: req.employeeId, componentId: req.componentId, isActive: true } });
                    if (record.length === 0 || Number(record[0]?.endDate) < Number(dayjs(req.startDate).format('YYYYMM'))) {
                        const numberOfTermsCount = req.termCount
                        const numberOfTotalTerms = req.totalTerms
                        const nonRecEntity = new EmpNonRecComponentsEntity();
                        nonRecEntity.employeeId = req.employeeId;
                        nonRecEntity.componentId = req.componentId;
                        nonRecEntity.totalAmount = req.amount * ((numberOfTotalTerms - numberOfTermsCount) + 1)
                        nonRecEntity.emiCount = req.totalTerms;
                        nonRecEntity.emiAmount = Number(req.amount)
                        nonRecEntity.isPermanent = req.isPermanent === 'No' ? 0 : 1;
                        nonRecEntity.startDate = dayjs(req.startDate).format('YYYYMM');
                        const totalMonthsToAdd = (numberOfTotalTerms - numberOfTermsCount) + 1;
                        let startYear = parseInt(nonRecEntity.startDate.substring(0, 4));
                        let startMonth = parseInt(nonRecEntity.startDate.substring(4, 6));
                        let months = [];
                        for (let i = 0; i < totalMonthsToAdd; i++) {
                            const month = `${startYear}${(startMonth < 10 ? '0' : '') + startMonth}`;
                            months.push(month);
                            startMonth++;
                            if (startMonth > 12) {
                                startMonth = 1;
                                startYear++;
                            }
                        }
                        const endDate = months[months.length - 1];
                        nonRecEntity.endDate = endDate;
                        const nonRecSave = await this.empNonRecComponentsRepo.save(nonRecEntity);
                        if (nonRecSave) {
                            for (let j = 0; j < months.length; j++) {
                                const termEntity = new EmpNonRecTermsEntity();
                                termEntity.employeeId = req.employeeId;
                                termEntity.componentId = req.componentId;
                                termEntity.empNonRecComponent = nonRecSave;
                                termEntity.termAmount = nonRecEntity.emiAmount;
                                termEntity.totalTerms = numberOfTotalTerms;
                                const x = Number(j) + Number(numberOfTermsCount)
                                termEntity.termCount = `${x}/${numberOfTotalTerms}`;
                                termEntity.payMonth = months[j];
                                await this.empNonRecurringTermsRepo.save(termEntity);
                            }
                        }
                        //logs maintaing for create
                        const logsEntity = new NonRecTermsLogsEntity()
                        logsEntity.employeeId = req.employeeId, logsEntity.componentId = req.componentId, logsEntity.nonRecurringId = nonRecSave.id
                        logsEntity.role = req.createdUser, logsEntity.actionType = ActionTypeEnum.CREATE, logsEntity.updatedValues = nonRecEntity, logsEntity.updatedUser = req.updatedUser
                        const log = await this.employeeNonRecurringLogsRepository.save(logsEntity)

                    } else {
                        const nonRecEntity = record[0] as EmpNonRecComponentsEntity
                        const nre = new EmpNonRecComponentsEntity
                        nre.id = nonRecEntity.id
                        if (Number(record[0].endDate) > Number(dayjs(req.startDate).format('YYYYMM'))) {
                            const nonRecEntity = new EmpNonRecComponentsEntity();
                            const numberOfTermsCount = req.termCount
                            const numberOfTotalTerms = req.totalTerms
                            const totalMonthsToAdd = (numberOfTotalTerms - numberOfTermsCount) + 1;
                            const endDate = dayjs(req.startDate).add(totalMonthsToAdd, 'month').format('YYYYMM');
                            const processedCount = await this.empNonRecurringTermsRepo.find({ where: { empNonRecComponent: nre, isProcessed: true } })
                            const updateData: any = {
                                endDate: endDate,
                                emiAmount: req.amount,
                                emiCount: totalMonthsToAdd + processedCount.length,
                            }
                            const previousData = await this.empNonRecComponentsRepo.find({ where: { id: nonRecEntity.id } })
                            const save = await this.empNonRecComponentsRepo.update({ id: nonRecEntity.id }, updateData)
                            const logsEntity = new NonRecTermsLogsEntity()
                            if (save) {
                                //logs maintaing for update
                                logsEntity.employeeId = req.employeeId, logsEntity.componentId = req.componentId, logsEntity.role = req.createdUser,
                                    logsEntity.nonRecurringId = nonRecEntity.id, logsEntity.actionType = ActionTypeEnum.UPDATE, logsEntity.updatedValues = updateData, logsEntity.updatedUser = req.updatedUser
                                const log = await this.employeeNonRecurringLogsRepository.save(logsEntity)
                            }
                            if (save) {
                                for (let j = 0; j < totalMonthsToAdd; j++) {
                                    const termEntity = new EmpNonRecTermsEntity();
                                    const d = await this.empNonRecurringTermsRepo.delete({ empNonRecComponent: nre, isProcessed: false, payMonth: dayjs(req.startDate).add(j, 'month').format('YYYYMM') });
                                    const previousData = await this.empNonRecurringTermsRepo.find({ where: { empNonRecComponent: nre, isProcessed: false, payMonth: dayjs(req.startDate).add(j, 'month').format('YYYYMM') } })
                                    if (d) {
                                        //logs maintaing for DELETE
                                        logsEntity.employeeId = req.employeeId, logsEntity.componentId = req.componentId, logsEntity.nonRecurringId = nonRecEntity.id
                                        logsEntity.role = req.createdUser, logsEntity.actionType = ActionTypeEnum.DELETE, logsEntity.updatedUser = req.updatedUser
                                        const log = await this.employeeNonRecurringLogsRepository.save(logsEntity)
                                    }
                                    termEntity.employeeId = req.employeeId;
                                    termEntity.componentId = req.componentId;
                                    termEntity.empNonRecComponent = nre;
                                    termEntity.termAmount = req.amount;
                                    termEntity.totalTerms = numberOfTotalTerms;
                                    const x = Number(j) + Number(numberOfTermsCount)
                                    termEntity.termCount = `${x}/${numberOfTotalTerms}`;
                                    termEntity.payMonth = dayjs(req.startDate).add(j, 'month').format('YYYYMM');
                                    await this.empNonRecurringTermsRepo.save(termEntity);
                                }
                            }
                        } else {
                            employees.push(req.employeeId)
                        }

                    }
                } else if (req.isPermanent === 'Yes') {
                    const nonRecEntity = new EmpNonRecComponentsEntity();
                    nonRecEntity.employeeId = req.employeeId;
                    nonRecEntity.componentId = req.componentId;
                    nonRecEntity.totalAmount = req.amount
                    nonRecEntity.emiCount = null;
                    nonRecEntity.emiAmount = req.amount
                    nonRecEntity.isPermanent = req.isPermanent === 'Yes' ? 1 : 0;
                    nonRecEntity.startDate = dayjs(req.startDate).format('YYYYMM');

                    const nonRecSave = await this.empNonRecComponentsRepo.save(nonRecEntity);
                }

            }
            // await this.payrollRecordsService.generateEmpPayrollRecords();
            // await transactionalManager.completeTransaction();
            if (employees.length === 0) {
                return new CommonResponseModel(true, 1, "Employee Records Saved");
            } else {
                return new CommonResponseModel(true, 1, "Some Employees Records Already in process can't add another", employees);
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, "Something went wrong");
            // await transactionalManager.releaseTransaction();
        }
    }

    async getEmpRecComponent(): Promise<CommonResponseModel> {
        try {
            const result = await this.empRecComRepository.getEmpRecComponent();
            if (result && result.length > 0) {
                return new CommonResponseModel(true, 6281481725, 'Data Retrieved', result);
            } else {
                return new CommonResponseModel(false, 8309649082, 'No Data Found');
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, 'Failed', err);
        }
    }

    async getEmpExtraMessDaysForPayroll(req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.empRecComRepository.findOne({ where: { employeeId: req.employeeId, payMonth: req.payMonth } });
            if (result) {
                return new CommonResponseModel(true, 6281481725, 'Data Retrieved', result);
            } else {
                return new CommonResponseModel(false, 8309649082, 'No Data Found');
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, 'Failed', err);
        }
    }

    async messExtraDaysExcel(formData: any): Promise<CommonResponseModel> {
        const transactionManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionManager.startTransaction();
            // console.log(formData)
            // Standardizing column names
            const columnSet = new Set<string>();
            const flag = new Set<boolean>();
            const updatedArray = formData.map(obj => {
                const reqObj = {};
                for (const key in obj) {
                    const newKey = key.replace(/\s/g, '').replace(/[\(\)\.]/g, '').replace(/-/g, '');
                    if (newKey) {
                        columnSet.add(newKey);
                        reqObj[newKey] = obj[key] === "" ? null : obj[key]; // Convert empty strings to null
                    }
                }
                return reqObj;
            });

            // Validate columns
            const invalidColumns = [...columnSet].filter(col => !MessExtraDaysColumns.includes(col));
            if (invalidColumns.length > 0) {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 1110, "Excel columns don't match. Please attach the correct file.");
            }
            // console.log(updatedArray, 'updatedArray')
            for (const data of updatedArray) {
                const req = new EmployeeCodeReq(data.EmpId)
                const payMonth = moment(data.Date).format('YYYYMM');
                const emp = await this.employeeOnboardingService.getEmpByCode(req)
                if (!emp || !emp.data) {
                    console.error(`Employee not found for EmpId: ${data.EmpId}`);
                    flag.add(false);
                    continue; // Skip this entry and move to the next
                }
                let addSave
                const addObj = new EmpRecComponentsEntity();
                addObj.amount = data.ExtraDays;
                addObj.employeeId = emp.data.employeeId;
                addObj.componentId = 68;
                addObj.payMonth = payMonth;
                const findEmpId = await transactionManager.getRepository(EmpRecComponentsEntity).find({ where: { employeeId: emp.data.employeeId, componentId: 68, payMonth: payMonth } });
                if (findEmpId.length > 0) {
                    addSave = await transactionManager.getRepository(EmpRecComponentsEntity).update({ employeeId: emp.data.employeeId, componentId: 68, payMonth: payMonth }, { amount: data.ExtraDays })
                } else {
                    addSave = await transactionManager.getRepository(EmpRecComponentsEntity).save(addObj);
                }
                if (!addSave) {
                    flag.add(false);
                    await transactionManager.releaseTransaction();
                    break;
                }
            }

            if (!flag.has(false)) {
                await transactionManager.completeTransaction();
                return new CommonResponseModel(true, 1, 'Data saved successfully');
            } else {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 0, 'Something went wrong');
            }
        } catch (err) {
            console.error(err, "Error saving address info");
            await transactionManager.releaseTransaction();
            return new CommonResponseModel(false, 0, "An error occurred while processing the data", err);
        }
    }
}
