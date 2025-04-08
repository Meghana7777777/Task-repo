import { CommonResponseModel } from '@hrexpert/backend-utils';
import { AttendanceServices, EmployeeOnboardingService, EmpRecCompSharedService, MonthWIseEmpReportReq } from '@hrexpert/shared-services';
import { Injectable } from '@nestjs/common';
import { DataSource, Entity, In } from 'typeorm';
import { GenericTransactionManager } from '../../database/type-orm-transactions';
import { PayrollAttendanceEntity } from './entites/payroll-attendance-entity';
import { PayrollAttendanceRepository } from './payroll-attendance-repository';
import { MonthReq } from './dto/payroll-attendance-dto';
import { PayrollRecordsRepository } from '../payroll-records/repositories/payroll-records.repository';
import { EmployeeNonRecurringTermsRepository } from '../payroll-records/repositories/emp-non-rec-terms.repo';
import { PayrollProcessedLogRepository } from '../payroll-processed-log/payroll-processed-log.repository';
import { PayrollProcessedLogEntity } from '../payroll-processed-log/entites/payroll-processed-log.entity';
import { PayrollEmployeesRepository } from '../payroll-employees/repositories/payroll-employees.repository';
import { PayrollComponentsRepository } from '../payroll-components/repositories/payroll-components.repository';
import { BranchMonthReq, ComponentTypeEnum, TypeEnum } from '@hrexpert/shared-models';
import { EmpRecComRepository } from '../emp-rec-components/entities/emp-rec-components.repo';
import { EmployeeNonRecurringComponentsRepository } from '../payroll-records/repositories/emp-non-rec-components.repo';
import { PayrollWeeklyAttendanceEntity } from './entites/payroll-weekly-attendance-entity';
import { PayrollWeeklyAttendanceRepository } from './payroll-weekly-attendance-repo';
import dayjs from 'dayjs';
import { DayWisePayService } from '../day-wise-pay/day-wise-pay.service';

@Injectable()
export class PayrollAttendanceService {
    constructor(
        private payrollAttnRepo: PayrollAttendanceRepository,
        private payrollWWeeklyAttnRepo: PayrollWeeklyAttendanceRepository,
        private payrollRecordsRepo: PayrollRecordsRepository,
        private empNonRecTermsRepo: EmployeeNonRecurringTermsRepository,
        private payrollProcessedLogRepo: PayrollProcessedLogRepository,
        private payrollEmployeesRepo: PayrollEmployeesRepository,
        private payrollComponentsRepo: PayrollComponentsRepository,
        private employeeRecComponentsRepo: EmpRecComRepository,
        private empNonRecComponentsRepo: EmployeeNonRecurringComponentsRepository,
        private attenService: AttendanceServices,
        private employeeService: EmployeeOnboardingService,
        private dayWisePayService: DayWisePayService,
        private empRecCompService: EmpRecCompSharedService,
        private dataSource: DataSource
    ) { }


    async createPayrollAttendance(req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        const transactionManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionManager.startTransaction();
            const attnData = await this.attenService.getAllEmpMonthWiseDataWithoutPagination(req);
            // console.log(attnData, 'attnData')
            // console.log(req, 'rrrrrr')
            const payrollEntities = attnData.data.map((data) => {
                const formattedOtHours = data.splOtHours === 'NaN:NaN:NaN' ? '00:00:00' : data.splOtHours;
                const entity = new PayrollAttendanceEntity();
                entity.employeeId = data.empId;
                entity.employeeCode = data.empCode;
                entity.presentCount = data.presentCount;
                entity.absentCount = data.absentCount;
                entity.leaveCount = data.leaveCount;
                entity.coCount = data.coCount;
                entity.odCount = data.odCount;
                entity.wpCount = data.wpCount;
                entity.woCount = data.woCount;
                entity.otHours = formattedOtHours;
                entity.holidayCount = data.holidayCount;
                entity.hpCount = data.hpCount;
                entity.branchId = data.branchId;
                entity.divisionId = data.divisionId;
                entity.departmentId = data.departmentId;
                entity.designationId = data.desginationId;
                entity.employeeTypeId = data.employeeTypeId;
                entity.payrollMonth = req.date;
                entity.payDays = data?.payDays;
                entity.allowanceDays = data?.allowanceDays;
                entity.lateMinutes = data?.lateMinutes;
                entity.bankName = data?.bankName;
                entity.bankAccNo = data?.bankAccNo;
                entity.bankIfscCode = data?.bankIfscCode;
                entity.payMode = data?.payMode
                entity.lateMinsDeductDays = data?.lateMinsDeductDays
                entity.lopData = data?.lopCountData
                return entity;
            });
            if (payrollEntities.length > 0) {
                for (const entity of payrollEntities) {
                    const existingRecord = await this.payrollAttnRepo.findOne({
                        where: {
                            payrollMonth: entity.payrollMonth,
                            employeeId: entity.employeeId
                        },
                    });
                    if (existingRecord) {
                        await this.payrollAttnRepo.update(
                            { employeeId: existingRecord.employeeId, payrollMonth: existingRecord.payrollMonth },
                            {
                                presentCount: entity.presentCount,
                                absentCount: entity.absentCount,
                                leaveCount: entity.leaveCount,
                                coCount: entity.coCount,
                                odCount: entity.odCount,
                                wpCount: entity.wpCount,
                                woCount: entity.woCount,
                                otHours: entity.otHours,
                                holidayCount: entity.holidayCount,
                                hpCount: entity.hpCount,
                                departmentId: entity.departmentId,
                                designationId: entity.designationId,
                                employeeTypeId: entity.employeeTypeId,
                                payDays: entity?.payDays,
                                allowanceDays: entity?.allowanceDays,
                                lateMinutes: entity?.lateMinutes,
                                bankName: entity?.bankName,
                                bankAccNo: entity?.bankAccNo,
                                bankIfscCode: entity?.bankIfscCode,
                                payMode: entity?.payMode,
                                lateMinsDeductDays: entity?.lateMinsDeductDays,
                                lopData:entity.lopData
                            }
                        );
                    } else {
                        await this.payrollAttnRepo.save(entity);
                    }
                }
            }
            await transactionManager.completeTransaction();
            return new CommonResponseModel(true, 1, 'Payroll Attendance Saved Successfully');
        } catch (err) {
            await transactionManager.releaseTransaction();
            return new CommonResponseModel(false, 0, 'Error In Payroll Attendance Creation', err);
        }
    }

    async getPayRollAttendance(req: BranchMonthReq): Promise<CommonResponseModel> {
        const data = await this.payrollAttnRepo.getEmployeePayAttendance(req)
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data,);
        } else {
            return new CommonResponseModel(false, 11, 'Data not found as per your filtration');
        }
    }

    async generatePayroll(req: BranchMonthReq): Promise<CommonResponseModel> {
        try {
            const employeeAttnData = await this.payrollAttnRepo.find({ where: { branchId: req.branchId, payrollMonth: req.month, divisionId: In(req.divisionId), employeeTypeId: req.employeeType, employeeId: req.employeeId } })
            if (employeeAttnData.length > 0) {
                // Generate Payroll
                for (const emp of employeeAttnData) {
                    const empData = await this.employeeService.getEmpById({ employeeId: emp.employeeId })
                    let messExtraDays;
                    const messExtraDaysData = await this.empRecCompService.getEmpExtraMessDaysForPayroll({ employeeId: emp.employeeId, payMonth: req.month });
                    // console.log(messExtraDaysData, 'messExtraDaysData')
                    if (messExtraDaysData.status) {
                        messExtraDays = Number(messExtraDaysData.data.amount);
                    } else {
                        messExtraDays = 0;
                    }
                    // console.log(messExtraDays, 'messExtraDays')
                    // console.log(empData.data)
                    if (!empData) {
                        continue;
                    } else {
                        if (empData.data.employeeType == 'EMPLOYEE') {
                            const payrollRec = await this.payrollRecordsRepo.findOne({ where: { employeeId: emp.employeeId, isActive: true, status: "FINAL" } })
                            // // Extract year and month from the string
                            // const year = parseInt(req.month.substring(0, 4), 10); // First 4 characters as year
                            // const month = parseInt(req.month.substring(4, 6), 10); // Last 2 characters as month

                            // // Calculate the number of days in the month
                            // const monthDays = new Date(year, month, 0).getDate();
                            let componentRecords = {};
                            let updatedRecords = {}
                            let addComponents = {}
                            let holdStatus = false;
                            if (payrollRec) {
                                updatedRecords = Object.keys(payrollRec.componentRecords).filter(key => key !== 'GROSS').reduce((acc, key) => {
                                    const value = payrollRec.componentRecords[key]; // Get value of the current key
                                    // if (key === 'Mess Allowance') { 
                                    //     acc[key] = value * emp.payDays;
                                    // } else {
                                    acc[key] = ((value / 30) * emp.payDays).toFixed(0); // Apply formula
                                    // }
                                    return acc; // Return the accumulator
                                }, {});
                                const terms = await this.empNonRecTermsRepo.getAllTermsRecords(req.month, emp.employeeId)
                                if (terms.length > 0) {
                                    addComponents = terms.reduce((acc, item) => {
                                        acc[item.componentName] = parseFloat(item.termAmount); // Add component to object
                                        return acc;
                                    }, {});
                                    componentRecords = { ...updatedRecords, ...addComponents }
                                } else {
                                    componentRecords = { ...updatedRecords }
                                }
                                // console.log(componentRecords, '-----------AAAAAAAAAAAAA--------')
                                const deductions = await this.empNonRecComponentsRepo.getAllDeductionsRecords({ month: req.month, employeeId: emp.employeeId })
                                if (deductions.length > 0) {
                                    deductions.forEach((deduction) => {
                                        if (parseInt(deduction.startDate) <= parseInt(req.month)) {
                                            componentRecords[deduction.componentName] = deduction.totalAmount;
                                        }
                                    });
                                }
                                componentRecords['Mess Deductions'] = (Number(payrollRec.componentRecords['Mess Allowance']) / 30) * (emp.payDays + messExtraDays);
                                // console.log(componentRecords, '----------BBBBBBBBBBBBB-----------')
                                // console.log(addComponents)
                                const components = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 1, branchId: req.branchId } });
                                //console.log(componentRecords)

                                const grossAmount = Number(payrollRec.componentRecords['GROSS']);
                                let totalEarnings = 0;
                                let earnings = 0;
                                let totalDeductions = 0;

                                // Loop through the components to calculate total earnings and deductions
                                for (const component of components) {
                                    const componentName = component.componentName; // Get the name of the component
                                    const componentType = component.componentType;  // Get the type (earning or deduction)

                                    // Check if componentName exists in componentRecords and if so, calculate based on type
                                    if (componentRecords[componentName] !== undefined) {
                                        const amount = componentRecords[componentName]; // Get the amount for the component

                                        if (componentType === ComponentTypeEnum.EARNING) {
                                            earnings += Number(amount); // Add to total earnings
                                        }
                                    }
                                }

                                totalEarnings = Number(earnings)
                                // Calculate net payable

                                componentRecords['PT'] = totalEarnings > 20000 ? 200 : totalEarnings > 15000 ? 150 : 0;
                                componentRecords['Late Minute'] = (Number(componentRecords['GROSS'] / 30) * emp.lateMinsDeductDays).toFixed(0);
                                if (payrollRec.isPf === 'YES') {
                                    componentRecords['PF-Employee'] = Number(componentRecords['BASIC'] * 12 / 100) < 1800 ? Number(componentRecords['BASIC'] * 12 / 100).toFixed(0) : 1800;
                                    componentRecords['PF-Employer'] = Number(componentRecords['BASIC'] * 13 / 100) < 1800 ? Number(componentRecords['BASIC'] * 13 / 100).toFixed(0) : 1800;
                                } else {
                                    componentRecords['PF-Employee'] = 0;
                                    componentRecords['PF-Employer'] = 0;
                                }
                                if (payrollRec.isEsi === 'YES') {
                                    componentRecords['ESI-Employee'] = Number(totalEarnings * 0.75 / 100).toFixed(0);
                                    componentRecords['ESI-Employer'] = Number(totalEarnings * 0.75 / 100).toFixed(0);
                                } else {
                                    componentRecords['ESI-Employee'] = 0;
                                    componentRecords['ESI-Employer'] = 0;
                                }

                                for (const component of components) {
                                    const componentName = component.componentName; // Get the name of the component
                                    const componentType = component.componentType;  // Get the type (earning or deduction)

                                    // Check if componentName exists in componentRecords and if so, calculate based on type
                                    if (componentRecords[componentName] !== undefined) {
                                        const amount = componentRecords[componentName]; // Get the amount for the component
                                        if (componentType === ComponentTypeEnum.DEDUCTION) {
                                            totalDeductions += Number(amount); // Add to total deductions
                                        }
                                    }
                                }

                                const netPayable = Number(totalEarnings) - Number(totalDeductions);
                                if (netPayable < 0) {
                                    holdStatus = true;
                                }
                                if (netPayable > 10000 && payrollRec.payMode?.toUpperCase() === 'CASH') {
                                    holdStatus = true;
                                }
                                // Create the object to add to the payroll record
                                const updatedComponentRecords = {
                                    ...componentRecords,  // Assuming this contains the base component records
                                    'Total Earnings': (totalEarnings).toFixed(0),
                                    'Total Deductions': (totalDeductions).toFixed(0),
                                    'Net Payable': (netPayable).toFixed(0),
                                    'Gross': grossAmount,
                                    'CTC': Number(grossAmount) + Number(componentRecords['PF-Employer']) + Number(componentRecords['ESI-Employer'])
                                };
                                // console.log(updatedComponentRecords, 'UUUUUUUUUUU')
                                const payroll = await this.payrollProcessedLogRepo.findOne({
                                    where: {
                                        employeeId: emp.employeeId, payrollMonth: Number(req.month),
                                    }
                                })
                                if (payroll) {
                                    await this.payrollProcessedLogRepo.update({ employeeId: emp.employeeId, payrollMonth: Number(req.month) }, { componentRecords: updatedComponentRecords, payDays: emp.payDays, presentCount: emp.presentCount, absentCount: emp.absentCount, leaveCount: emp.leaveCount, payMode: emp.payMode, bankName: emp.bankName, bankIfscCode: emp.bankIfscCode, bankAccNo: emp.bankAccNo, netPay: Number(netPayable).toFixed(0) })
                                } else {
                                    const entity = new PayrollProcessedLogEntity()
                                    entity.componentRecords = updatedComponentRecords;
                                    entity.employeeId = emp.employeeId
                                    entity.payDays = emp.payDays
                                    entity.presentCount = emp.presentCount
                                    entity.absentCount = emp.absentCount
                                    entity.leaveCount = emp.leaveCount
                                    entity.branchId = emp.branchId
                                    entity.designationId = emp.designationId
                                    entity.departmentId = emp.departmentId
                                    entity.divisionId = emp.divisionId
                                    entity.employeeTypeId = emp.employeeTypeId
                                    entity.payMode = emp.payMode
                                    entity.bankName = emp.bankName
                                    entity.bankIfscCode = emp.bankIfscCode
                                    entity.bankAccNo = emp.bankAccNo
                                    entity.payrollMonth = Number(req.month)
                                    entity.netPay = Number(netPayable).toFixed(0)
                                    const save = await this.payrollProcessedLogRepo.save(entity)
                                }
                            } else {
                                continue;
                            }
                        }
                        else if (empData.data.employeeType == 'WORKER') {
                            const payrollRec = await this.payrollRecordsRepo.findOne({
                                where: {
                                    employeeId: emp.employeeId,
                                    status: "FINAL"
                                }
                            });
                            // console.log(payrollRec, "ppppppppppppppoooiii")
                            // Extract year and month from the string
                            const year = parseInt(req.month.substring(0, 4), 10); // First 4 characters as year
                            const month = parseInt(req.month.substring(4, 6), 10); // Last 2 characters as month

                            const monthDays = new Date(year, month, 0).getDate();
                            // console.log(addComponents)
                            const components = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 2, branchId: req.branchId } });

                            const perDayAmount = Number(payrollRec.componentRecords['PER DAY']);
                            console.log(perDayAmount)
                            let empBasic = 0;
                            const dayWiseRecs = await this.dayWisePayService.getWorkerEmpBasic({ employeeId: emp.employeeId, month: req.month });
                            const dayWiseData = dayWiseRecs?.data || [];

                            if (dayWiseData.length > 0) {
                                empBasic = dayWiseData.reduce((total, rec) => {
                                    const greaterValue = Math.max(Number(rec.totalEmpPay) || 0, perDayAmount);
                                    return total + greaterValue;
                                }, 0);
                            } else {
                                empBasic = perDayAmount * (Number(emp.payDays) || 0);
                            }

                            // Calculate the number of days in the month
                            let componentRecords = {};
                            let updatedRecords = {}
                            let addComponents = {}
                            let holdStatus = false;
                            if (payrollRec) {
                                const payrollComponents = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 2, branchId: req.branchId, componentType: ComponentTypeEnum.EARNING } });
                                for (const payrollComponent of payrollComponents) {
                                    if (payrollComponent.componentName === 'BASIC') {
                                        updatedRecords[payrollComponent.componentName] = (empBasic).toFixed(0);
                                    } else if (payrollComponent.componentName === 'Mess Allowance') {
                                        updatedRecords[payrollComponent.componentName] = (Number(payrollRec.componentRecords['Mess Allowance']) / 30) * emp.payDays;
                                    } else if (payrollComponent.componentName === 'Other Allowances') {
                                        updatedRecords[payrollComponent.componentName] = perDayAmount * emp.allowanceDays;
                                    } else if (payrollComponent.componentName === 'Attendance Incentive') {
                                        updatedRecords[payrollComponent.componentName] = emp.payDays >= (monthDays - 1) ? payrollRec.incentiveDays * perDayAmount : 0;
                                    } else if (payrollComponent.componentName === 'OT') {
                                        updatedRecords[payrollComponent.componentName] = 0;//emp.otHours * 100;
                                    }
                                }

                                const terms = await this.empNonRecTermsRepo.getAllTermsRecords(req.month, emp.employeeId)
                                if (terms.length > 0) {
                                    addComponents = terms.reduce((acc, item) => {
                                        acc[item.componentName] = parseFloat(item.termAmount); // Add component to object
                                        return acc;
                                    }, {});
                                    componentRecords = { ...updatedRecords, ...addComponents }
                                } else {
                                    componentRecords = { ...updatedRecords }
                                }
                                const deductions = await this.empNonRecComponentsRepo.getAllDeductionsRecords({ month: req.month, employeeId: emp.employeeId })
                                if (deductions.length > 0) {
                                    deductions.forEach((deduction) => {
                                        if (parseInt(deduction.startDate) <= parseInt(req.month)) {
                                            componentRecords[deduction.componentName] = deduction.totalAmount;
                                        }
                                    });
                                }

                                componentRecords['Mess Deductions'] = Number(payrollRec.componentRecords['Mess Allowance']) / 30 * (emp.payDays + messExtraDays);

                                // console.log(componentRecords)

                                let totalEarnings = 0;
                                let earnings = 0;
                                let totalDeductions = 0;

                                // Loop through the components to calculate total earnings and deductions
                                for (const component of components) {
                                    const componentName = component.componentName; // Get the name of the component
                                    const componentType = component.componentType;  // Get the type (earning or deduction)

                                    // Check if componentName exists in componentRecords and if so, calculate based on type
                                    if (componentRecords[componentName] !== undefined) {
                                        const amount = componentRecords[componentName]; // Get the amount for the component

                                        if (componentType === ComponentTypeEnum.EARNING) {
                                            earnings += Number(amount); // Add to total earnings
                                        }
                                    }
                                }

                                totalEarnings = Number(earnings)
                                // Calculate net payable
                                if (payrollRec.isPf === 'YES') {
                                    componentRecords['PF-Employee'] = Number(componentRecords['BASIC'] * 60 / 100) * 12 / 100 < 1800 ? (Number(componentRecords['BASIC'] * 60 / 100) * 12 / 100).toFixed(0) : 1800;
                                    componentRecords['PF-Employer'] = Number(componentRecords['BASIC'] * 60 / 100) * 12 / 100 < 1800 ? (Number(componentRecords['BASIC'] * 60 / 100) * 12 / 100).toFixed(0) : 1800;
                                } else {
                                    componentRecords['PF-Employee'] = 0;
                                    componentRecords['PF-Employer'] = 0;
                                }
                                if (payrollRec.isEsi === 'YES') {
                                    componentRecords['ESI-Employee'] = Number(totalEarnings * 0.75 / 100).toFixed(0);
                                    componentRecords['ESI-Employer'] = Number(totalEarnings * 0.75 / 100).toFixed(0);
                                } else {
                                    componentRecords['ESI-Employee'] = 0;
                                    componentRecords['ESI-Employer'] = 0;
                                }

                                for (const component of components) {
                                    const componentName = component.componentName; // Get the name of the component
                                    const componentType = component.componentType;  // Get the type (earning or deduction)

                                    // Check if componentName exists in componentRecords and if so, calculate based on type
                                    if (componentRecords[componentName] !== undefined) {
                                        const amount = componentRecords[componentName]; // Get the amount for the component
                                        if (componentType === ComponentTypeEnum.DEDUCTION) {
                                            totalDeductions += Number(amount); // Add to total deductions
                                        }
                                    }
                                }
                                // Calculate net payable
                                const netPayable = Number(totalEarnings) - Number(totalDeductions);
                                if (netPayable < 0) {
                                    holdStatus = true;
                                }
                                if (netPayable > 10000 && payrollRec.payMode?.toUpperCase() === 'CASH') {
                                    holdStatus = true;
                                }
                                // Create the object to add to the payroll record
                                const updatedComponentRecords = {
                                    'PER DAY': perDayAmount,
                                    ...componentRecords,  // Assuming this contains the base component records
                                    'Total Earnings': (totalEarnings).toFixed(0),
                                    'Total Deductions': (totalDeductions).toFixed(0),
                                    'Net Payable': (netPayable).toFixed(0),
                                    'Gross': (totalEarnings).toFixed(0),
                                    'CTC': (Number(totalEarnings) + Number(componentRecords['PF-Employer']) + Number(componentRecords['ESI-Employer'])).toFixed(0)
                                };
                                // console.log(updatedComponentRecords, 'UUUUUUUUUUU')
                                const payroll = await this.payrollProcessedLogRepo.findOne({
                                    where: {
                                        employeeId: emp.employeeId, payrollMonth: Number(req.month),
                                    }
                                })
                                if (payroll) {
                                    await this.payrollProcessedLogRepo.update({ employeeId: emp.employeeId, payrollMonth: Number(req.month) }, { componentRecords: updatedComponentRecords, payDays: emp.payDays, presentCount: emp.presentCount, absentCount: emp.absentCount, leaveCount: emp.leaveCount, payMode: emp.payMode, bankName: emp.bankName, bankIfscCode: emp.bankIfscCode, bankAccNo: emp.bankAccNo, netPay: Number(netPayable).toFixed(0) })
                                } else {
                                    const entity = new PayrollProcessedLogEntity()
                                    entity.componentRecords = updatedComponentRecords;
                                    entity.employeeId = emp.employeeId
                                    entity.payDays = emp.payDays
                                    entity.presentCount = emp.presentCount
                                    entity.absentCount = emp.absentCount
                                    entity.leaveCount = emp.leaveCount
                                    entity.branchId = emp.branchId
                                    entity.designationId = emp.designationId
                                    entity.departmentId = emp.departmentId
                                    entity.divisionId = emp.divisionId
                                    entity.employeeTypeId = emp.employeeTypeId
                                    entity.payMode = emp.payMode
                                    entity.bankName = emp.bankName
                                    entity.bankIfscCode = emp.bankIfscCode
                                    entity.bankAccNo = emp.bankAccNo
                                    entity.payrollMonth = Number(req.month)
                                    entity.netPay = Number(netPayable).toFixed(0)
                                    const save = await this.payrollProcessedLogRepo.save(entity)
                                }
                            } else {
                                continue;
                            }
                        }
                        else if (empData.data.employeeType === 'KARLAM WORKER') {
                            const payrollRec = await this.payrollRecordsRepo.findOne({ where: { employeeId: emp.employeeId, status: "FINAL" } })
                            // Extract year and month from the string
                            const year = parseInt(req.month.substring(0, 4), 10); // First 4 characters as year
                            const month = parseInt(req.month.substring(4, 6), 10); // Last 2 characters as month
                            // console.log(addComponents)
                            const components = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 2, branchId: req.branchId } });

                            const perDayAmount = Number(payrollRec.componentRecords['PER DAY']);
                            let empBasic = 0;
                            const dayWiseRecs = await this.dayWisePayService.getWorkerEmpBasic({ employeeId: emp.employeeId, month: req.month });
                            const dayWiseData = dayWiseRecs?.data || [];

                            if (dayWiseData.length > 0) {
                                empBasic = dayWiseData.reduce((total, rec) => {
                                    const greaterValue = Math.max(Number(rec.totalEmpPay) || 0, perDayAmount);
                                    return total + greaterValue;
                                }, 0);
                            } else {
                                empBasic = perDayAmount * (Number(emp.payDays) || 0);
                            }
                            // Calculate the number of days in the month
                            const monthDays = new Date(year, month, 0).getDate();
                            let componentRecords = {};
                            let updatedRecords = {}
                            let addComponents = {}
                            let holdStatus = false;
                            if (payrollRec) {
                                const payrollComponents = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 2, branchId: req.branchId, componentType: ComponentTypeEnum.EARNING } });
                                for (const payrollComponent of payrollComponents) {
                                    if (payrollComponent.componentName === 'BASIC') {
                                        updatedRecords[payrollComponent.componentName] = (empBasic).toFixed(0);
                                    } else if (payrollComponent.componentName === 'Mess Allowance') {
                                        updatedRecords[payrollComponent.componentName] = (Number(payrollRec.componentRecords['Mess Allowance']) / 30) * emp.payDays;
                                    } else if (payrollComponent.componentName === 'Attendance Incentive') {
                                        updatedRecords[payrollComponent.componentName] = emp.payDays >= (monthDays - 1) ? payrollRec.incentiveDays * perDayAmount : 0;
                                    } else if (payrollComponent.componentName === 'OT') {
                                        updatedRecords[payrollComponent.componentName] = 0;//emp.otHours * 100;
                                    }
                                }

                                const terms = await this.empNonRecTermsRepo.getAllTermsRecords(req.month, emp.employeeId)
                                if (terms.length > 0) {
                                    addComponents = terms.reduce((acc, item) => {
                                        acc[item.componentName] = parseFloat(item.termAmount); // Add component to object
                                        return acc;
                                    }, {});
                                    componentRecords = { ...updatedRecords, ...addComponents }
                                } else {
                                    componentRecords = { ...updatedRecords }
                                }
                                const deductions = await this.empNonRecComponentsRepo.getAllDeductionsRecords({ month: req.month, employeeId: emp.employeeId })
                                if (deductions.length > 0) {
                                    deductions.forEach((deduction) => {
                                        if (parseInt(deduction.startDate) <= parseInt(req.month)) {
                                            componentRecords[deduction.componentName] = deduction.totalAmount;
                                        }
                                    });
                                }

                                componentRecords['Mess Deductions'] = Number(payrollRec.componentRecords['Mess Allowance']) / 30 * (emp.payDays + messExtraDays);

                                console.log(componentRecords)

                                let totalEarnings = 0;
                                let earnings = 0;
                                let totalDeductions = 0;
                                // Loop through the components to calculate total earnings and deductions
                                for (const component of components) {
                                    const componentName = component.componentName; // Get the name of the component
                                    const componentType = component.componentType;  // Get the type (earning or deduction)

                                    // Check if componentName exists in componentRecords and if so, calculate based on type
                                    if (componentRecords[componentName] !== undefined) {
                                        const amount = componentRecords[componentName]; // Get the amount for the component

                                        if (componentType === ComponentTypeEnum.EARNING) {
                                            earnings += Number(amount); // Add to total earnings
                                        }
                                    }
                                }

                                totalEarnings = Number(earnings)
                                // Calculate net payable
                                if (payrollRec.isPf === 'YES') {
                                    componentRecords['PF-Employee'] = Number(componentRecords['BASIC'] * 60 / 100) * 12 / 100 < 1800 ? (Number(componentRecords['BASIC'] * 60 / 100) * 12 / 100).toFixed(0) : 1800;
                                    componentRecords['PF-Employer'] = Number(componentRecords['BASIC'] * 60 / 100) * 12 / 100 < 1800 ? (Number(componentRecords['BASIC'] * 60 / 100) * 12 / 100).toFixed(0) : 1800;

                                } else {
                                    componentRecords['PF-Employee'] = 0;
                                    componentRecords['PF-Employer'] = 0;
                                }
                                if (payrollRec.isEsi === 'YES') {
                                    componentRecords['ESI-Employee'] = Number(totalEarnings * 0.75 / 100).toFixed(0);
                                    componentRecords['ESI-Employer'] = Number(totalEarnings * 0.75 / 100).toFixed(0);
                                } else {
                                    componentRecords['ESI-Employee'] = 0;
                                    componentRecords['ESI-Employer'] = 0;
                                }

                                for (const component of components) {
                                    const componentName = component.componentName; // Get the name of the component
                                    const componentType = component.componentType;  // Get the type (earning or deduction)

                                    // Check if componentName exists in componentRecords and if so, calculate based on type
                                    if (componentRecords[componentName] !== undefined) {
                                        const amount = componentRecords[componentName]; // Get the amount for the component
                                        if (componentType === ComponentTypeEnum.DEDUCTION) {
                                            totalDeductions += Number(amount); // Add to total deductions
                                        }
                                    }
                                }
                                // Calculate net payable
                                const netPayable = Number(totalEarnings) - Number(totalDeductions);
                                if (netPayable < 0) {
                                    holdStatus = true;
                                }
                                if (netPayable > 10000 && payrollRec.payMode?.toUpperCase() === 'CASH') {
                                    holdStatus = true;
                                }

                                // Create the object to add to the payroll record
                                const updatedComponentRecords = {
                                    'PER DAY': perDayAmount,
                                    ...componentRecords,  // Assuming this contains the base component records
                                    'Total Earnings': (totalEarnings).toFixed(0),
                                    'Total Deductions': (totalDeductions).toFixed(0),
                                    'Net Payable': (netPayable).toFixed(0),
                                    'Gross': (totalEarnings).toFixed(0),
                                    'CTC': (totalEarnings).toFixed(0) + Number(componentRecords['PF-Employer']) + Number(componentRecords['ESI-Employer'])
                                };
                                // console.log(updatedComponentRecords, 'UUUUUUUUUUU')
                                const payroll = await this.payrollProcessedLogRepo.findOne({
                                    where: {
                                        employeeId: emp.employeeId, payrollMonth: Number(req.month),
                                    }
                                })
                                if (payroll) {
                                    await this.payrollProcessedLogRepo.update({ employeeId: emp.employeeId, payrollMonth: Number(req.month) }, { componentRecords: updatedComponentRecords, payDays: emp.payDays, presentCount: emp.presentCount, absentCount: emp.absentCount, leaveCount: emp.leaveCount, payMode: emp.payMode, bankName: emp.bankName, bankIfscCode: emp.bankIfscCode, bankAccNo: emp.bankAccNo, netPay: Number(netPayable).toFixed(0) })
                                } else {
                                    const entity = new PayrollProcessedLogEntity()
                                    entity.componentRecords = updatedComponentRecords;
                                    entity.employeeId = emp.employeeId
                                    entity.payDays = emp.payDays
                                    entity.presentCount = emp.presentCount
                                    entity.absentCount = emp.absentCount
                                    entity.leaveCount = emp.leaveCount
                                    entity.branchId = emp.branchId
                                    entity.designationId = emp.designationId
                                    entity.departmentId = emp.departmentId
                                    entity.divisionId = emp.divisionId
                                    entity.employeeTypeId = emp.employeeTypeId
                                    entity.payMode = emp.payMode
                                    entity.bankName = emp.bankName
                                    entity.bankIfscCode = emp.bankIfscCode
                                    entity.bankAccNo = emp.bankAccNo
                                    entity.payrollMonth = Number(req.month)
                                    entity.netPay = Number(netPayable).toFixed(0)
                                    const save = await this.payrollProcessedLogRepo.save(entity)
                                }
                            } else {
                                continue;
                            }
                        }
                        else if (empData.data.employeeType === 'WEEKLY WORKERS') {
                            const payrollRec = await this.payrollRecordsRepo.findOne({ where: { employeeId: emp.employeeId, status: "FINAL" } })
                            // Extract year and month from the string
                            const year = parseInt(req.month.substring(0, 4), 10); // First 4 characters as year
                            const month = parseInt(req.month.substring(4, 6), 10); // Last 2 characters as month

                            const monthDays = new Date(year, month, 0).getDate();
                            // console.log(addComponents)
                            const components = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 2, branchId: req.branchId } });

                            const perDayAmount = Number(payrollRec.componentRecords['PER DAY']);
                            let empBasic = 0;
                            const dayWiseRecs = await this.dayWisePayService.getWorkerEmpBasic({ employeeId: emp.employeeId, month: req.month });
                            const dayWiseData = dayWiseRecs?.data || [];

                            if (dayWiseData.length > 0) {
                                empBasic = dayWiseData.reduce((total, rec) => {
                                    const greaterValue = Math.max(Number(rec.totalEmpPay) || 0, perDayAmount);
                                    return total + greaterValue;
                                }, 0);
                            } else {
                                empBasic = perDayAmount * (Number(emp.payDays) || 0);
                            }
                            // Calculate the number of days in the month
                            let componentRecords = {};
                            let updatedRecords = {}
                            let addComponents = {}
                            let holdStatus = false;
                            if (payrollRec) {
                                const payrollComponents = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 2, branchId: req.branchId, componentType: ComponentTypeEnum.EARNING } });
                                for (const payrollComponent of payrollComponents) {
                                    if (payrollComponent.componentName === 'BASIC') {
                                        updatedRecords[payrollComponent.componentName] = (empBasic).toFixed(0);
                                    } else if (payrollComponent.componentName === 'Mess Allowance') {
                                        updatedRecords[payrollComponent.componentName] = (Number(payrollRec.componentRecords['Mess Allowance']) / 30) * emp.payDays;
                                    } else if (payrollComponent.componentName === 'Other Allowances') {
                                        updatedRecords[payrollComponent.componentName] = perDayAmount * emp.allowanceDays;
                                    } else if (payrollComponent.componentName === 'Attendance Incentive') {
                                        updatedRecords[payrollComponent.componentName] = emp.payDays >= (monthDays - 1) ? payrollRec.incentiveDays * perDayAmount : 0;
                                    } else if (payrollComponent.componentName === 'OT') {
                                        updatedRecords[payrollComponent.componentName] = 0;//emp.otHours * 100;
                                    }
                                }

                                const terms = await this.empNonRecTermsRepo.getAllTermsRecords(req.month, emp.employeeId)
                                if (terms.length > 0) {
                                    addComponents = terms.reduce((acc, item) => {
                                        acc[item.componentName] = parseFloat(item.termAmount); // Add component to object
                                        return acc;
                                    }, {});
                                    componentRecords = { ...updatedRecords, ...addComponents }
                                } else {
                                    componentRecords = { ...updatedRecords }
                                }
                                const deductions = await this.empNonRecComponentsRepo.getAllDeductionsRecords({ month: req.month, employeeId: emp.employeeId })
                                if (deductions.length > 0) {
                                    deductions.forEach((deduction) => {
                                        if (parseInt(deduction.startDate) <= parseInt(req.month)) {
                                            componentRecords[deduction.componentName] = deduction.totalAmount;
                                        }
                                    });
                                }

                                componentRecords['Mess Deductions'] = Number(payrollRec.componentRecords['Mess Allowance']) / 30 * (emp.payDays + messExtraDays);

                                // console.log(componentRecords)

                                let totalEarnings = 0;
                                let earnings = 0;
                                let totalDeductions = 0;
                                // Loop through the components to calculate total earnings and deductions
                                for (const component of components) {
                                    const componentName = component.componentName; // Get the name of the component
                                    const componentType = component.componentType;  // Get the type (earning or deduction)

                                    // Check if componentName exists in componentRecords and if so, calculate based on type
                                    if (componentRecords[componentName] !== undefined) {
                                        const amount = componentRecords[componentName]; // Get the amount for the component

                                        if (componentType === ComponentTypeEnum.EARNING) {
                                            earnings += Number(amount); // Add to total earnings
                                        }
                                    }
                                }

                                totalEarnings = Number(earnings)
                                // Calculate net payable
                                if (payrollRec.isPf === 'YES') {
                                    componentRecords['PF-Employee'] = Number(componentRecords['BASIC'] * 60 / 100) * 12 / 100 < 1800 ? (Number(componentRecords['BASIC'] * 60 / 100) * 12 / 100).toFixed(0) : 1800;
                                    componentRecords['PF-Employer'] = Number(componentRecords['BASIC'] * 60 / 100) * 12 / 100 < 1800 ? (Number(componentRecords['BASIC'] * 60 / 100) * 12 / 100).toFixed(0) : 1800;
                                } else {
                                    componentRecords['PF-Employee'] = 0;
                                    componentRecords['PF-Employer'] = 0;
                                }
                                if (payrollRec.isEsi === 'YES') {
                                    componentRecords['ESI-Employee'] = Number(totalEarnings * 0.75 / 100).toFixed(0);
                                    componentRecords['ESI-Employer'] = Number(totalEarnings * 0.75 / 100).toFixed(0);
                                } else {
                                    componentRecords['ESI-Employee'] = 0;
                                    componentRecords['ESI-Employer'] = 0;
                                }

                                for (const component of components) {
                                    const componentName = component.componentName; // Get the name of the component
                                    const componentType = component.componentType;  // Get the type (earning or deduction)

                                    // Check if componentName exists in componentRecords and if so, calculate based on type
                                    if (componentRecords[componentName] !== undefined) {
                                        const amount = componentRecords[componentName]; // Get the amount for the component
                                        if (componentType === ComponentTypeEnum.DEDUCTION) {
                                            totalDeductions += Number(amount); // Add to total deductions
                                        }
                                    }
                                }
                                // Calculate net payable
                                const netPayable = Number(totalEarnings) - Number(totalDeductions);
                                if (netPayable < 0) {
                                    holdStatus = true;
                                }
                                if (netPayable > 10000 && payrollRec.payMode?.toUpperCase() === 'CASH') {
                                    holdStatus = true;
                                }
                                // Create the object to add to the payroll record
                                const updatedComponentRecords = {
                                    'PER DAY': perDayAmount,
                                    ...componentRecords,  // Assuming this contains the base component records
                                    'Total Earnings': (totalEarnings).toFixed(0),
                                    'Total Deductions': (totalDeductions).toFixed(0),
                                    'Net Payable': (netPayable).toFixed(0),
                                    'Gross': (totalEarnings).toFixed(0),
                                    'CTC': (totalEarnings).toFixed(0) + Number(componentRecords['PF-Employer']) + Number(componentRecords['ESI-Employer'])
                                };
                                console.log(updatedComponentRecords, 'UUUUUUUUUUU')
                                const payroll = await this.payrollProcessedLogRepo.findOne({
                                    where: {
                                        employeeId: emp.employeeId, payrollMonth: Number(req.month),
                                    }
                                })
                                if (payroll) {
                                    await this.payrollProcessedLogRepo.update({ employeeId: emp.employeeId, payrollMonth: Number(req.month) }, { componentRecords: updatedComponentRecords, payDays: emp.payDays, presentCount: emp.presentCount, absentCount: emp.absentCount, leaveCount: emp.leaveCount, payMode: emp.payMode, bankName: emp.bankName, bankIfscCode: emp.bankIfscCode, bankAccNo: emp.bankAccNo, netPay: Number(netPayable).toFixed(0) })
                                } else {
                                    const entity = new PayrollProcessedLogEntity()
                                    entity.componentRecords = updatedComponentRecords;
                                    entity.employeeId = emp.employeeId
                                    entity.payDays = emp.payDays
                                    entity.presentCount = emp.presentCount
                                    entity.absentCount = emp.absentCount
                                    entity.leaveCount = emp.leaveCount
                                    entity.branchId = emp.branchId
                                    entity.designationId = emp.designationId
                                    entity.departmentId = emp.departmentId
                                    entity.divisionId = emp.divisionId
                                    entity.employeeTypeId = emp.employeeTypeId
                                    entity.payMode = emp.payMode
                                    entity.bankName = emp.bankName
                                    entity.bankIfscCode = emp.bankIfscCode
                                    entity.bankAccNo = emp.bankAccNo
                                    entity.payrollMonth = Number(req.month)
                                    entity.netPay = Number(netPayable).toFixed(0)
                                    const save = await this.payrollProcessedLogRepo.save(entity)
                                }
                            } else {
                                continue;
                            }
                        }
                    }
                }
                return new CommonResponseModel(true, 1, '')
            } else {
                return new CommonResponseModel(false, 0, 'No attendance data found')
            }
        } catch (error) {
            return new CommonResponseModel(false, 0, error)
        }
    }

    async updatePayRollFreezeStatus(req: MonthReq): Promise<CommonResponseModel> {
        const transactionManager = new GenericTransactionManager(this.dataSource);

        try {
            await transactionManager.startTransaction();
            // Update freeze status
            const attnUpdate = await this.payrollProcessedLogRepo.update(
                { payrollMonth: Number(req.month) },
                { freezeStatus: req.freezeStatus }
            );
            await transactionManager.completeTransaction();
            return new CommonResponseModel(true, 1111, 'Payroll freeze status updated successfully');
        } catch (err) {
            // Roll back the transaction in case of an error
            await transactionManager.completeTransaction();

            console.error('Error updating freeze status:', err);

            // Return error response
            return new CommonResponseModel(false, 0, 'Something went wrong', err);
        } finally {
            // Release the transaction manager
            await transactionManager.releaseTransaction();
        }
    }

    async createPayrollAttendanceForWeekly(req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        const transactionManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionManager.startTransaction();
            const attnData = await this.attenService.getAllEmpWeeklyWiseDataWithoutPagination(req);
            console.log(attnData, 'attnData')
            console.log(req, 'rrrrrr')
            const payrollEntities = attnData.data.map((data) => {
                const formattedOtHours = data.splOtHours === 'NaN:NaN:NaN' ? '00:00:00' : data.splOtHours;
                const entity = new PayrollWeeklyAttendanceEntity();
                entity.employeeId = data.empId;
                entity.employeeCode = data.empCode;
                entity.presentCount = data.presentCount;
                entity.absentCount = data.absentCount;
                entity.leaveCount = data.leaveCount;
                entity.coCount = data.coCount;
                entity.odCount = data.odCount;
                entity.wpCount = data.wpCount;
                entity.woCount = data.woCount;
                entity.otHours = formattedOtHours;
                entity.holidayCount = data.holidayCount;
                entity.hpCount = data.hpCount;
                entity.branchId = data.branchId;
                entity.divisionId = data.divisionId;
                entity.departmentId = data.departmentId;
                entity.designationId = data.desginationId;
                entity.payrollMonth = dayjs(req.date).format('YYYYMM')
                entity.payrollMonthWeek = `${req.attnFromDate.slice(0, 6)}F${req.attnFromDate.replace(/-/g, '').slice(6)}T${req.attnToDate.replace(/-/g, '').slice(6)}`
                entity.payDays = data?.payDays;
                entity.allowanceDays = data?.allowanceDays;
                entity.lateMinutes = data?.lateMinutes
                return entity;
            });
            if (payrollEntities.length > 0) {
                for (const entity of payrollEntities) {
                    const existingRecord = await this.payrollWWeeklyAttnRepo.findOne({
                        where: {
                            payrollMonth: entity.payrollMonth,
                            employeeId: entity.employeeId
                        },
                    });
                    if (existingRecord) {
                        await this.payrollWWeeklyAttnRepo.update(
                            { employeeId: existingRecord.employeeId, payrollMonth: existingRecord.payrollMonth },
                            {
                                presentCount: entity.presentCount,
                                absentCount: entity.absentCount,
                                leaveCount: entity.leaveCount,
                                coCount: entity.coCount,
                                odCount: entity.odCount,
                                wpCount: entity.wpCount,
                                woCount: entity.woCount,
                                otHours: entity.otHours,
                                holidayCount: entity.holidayCount,
                                hpCount: entity.hpCount,
                                departmentId: entity.departmentId,
                                designationId: entity.designationId,
                                payDays: entity?.payDays,
                                allowanceDays: entity?.allowanceDays,
                                lateMinutes: entity?.lateMinutes

                            }
                        );
                    } else {
                        await this.payrollWWeeklyAttnRepo.save(entity);
                    }
                }
            }
            await transactionManager.completeTransaction();
            return new CommonResponseModel(true, 1, 'Payroll Attendance Saved Successfully');
        } catch (err) {
            await transactionManager.releaseTransaction();
            return new CommonResponseModel(false, 0, 'Error In Payroll Attendance Creation', err);
        }
    }

}