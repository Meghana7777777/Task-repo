import { CommonResponseModel } from '@hrexpert/backend-utils';
import { ActionTypeEnum, ComponentTypeEnum, EmpNonRecurringReq, EmpNonRecurringRequest, EmpNonRecurringUpdateReq, TypeEnum } from '@hrexpert/shared-models';
import { EmployeeOnboardingService, PayrollComponentsSharedService, PayrollReq, WhatsUpService } from '@hrexpert/shared-services';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/type-orm-transactions';
import { EmpRecComRepository } from '../emp-rec-components/entities/emp-rec-components.repo';
import { PayrollComponentsEntity } from '../payroll-components/entites/payroll-components.entity';
import { PayrollComponentsRepository } from '../payroll-components/repositories/payroll-components.repository';
import { PayrollEmployeesEntity } from '../payroll-employees/entites/payroll-employees.entity';
import { PayrollProcessedLogDto } from '../payroll-processed-log/dto/payroll-processed-log.dto';
import { EmpNonRecComponentsEntity } from './entites/emp-non-rec-components.entity';
import { NonRecTermsLogsEntity } from './entites/emp-non-rec-terms-logs.entity';
import { EmpNonRecTermsEntity } from './entites/emp-non-rec-terms.entity';
import { PayrollRecordsEntity } from './entites/payroll-records.entity';
import { EmployeeNonRecurringComponentsRepository } from './repositories/emp-non-rec-components.repo';
import { EmployeeNonRecurringLogsRepository } from './repositories/emp-non-rec-terms-logs.repo';
import { EmployeeNonRecurringTermsRepository } from './repositories/emp-non-rec-terms.repo';
import { PayrollRecordsRepository } from './repositories/payroll-records.repository';

@Injectable()
export class PayrollRecordsService {
    constructor(
        private dataSource: DataSource,
        private payrollRecordsRepo: PayrollRecordsRepository,
        private payrollTypeComponentsRepository: PayrollComponentsSharedService,
        private employeeNonRecurringComponentsRepository: EmployeeNonRecurringComponentsRepository,
        private employeeNonRecurringTermsRepository: EmployeeNonRecurringTermsRepository,
        private payrollComponentsRepo: PayrollComponentsRepository,
        private employeeRecComponentsRepo: EmpRecComRepository,
        private empOnboardingService: EmployeeOnboardingService,
        private whatsService: WhatsUpService,
        private employeeNonRecurringLogsRepository: EmployeeNonRecurringLogsRepository

    ) { }

    async getPayrollComparisonReport(req: any): Promise<CommonResponseModel> {
        try {
            const { payrollMonth, employeeId } = req;
            const year = payrollMonth.slice(0, 4);
            const month = payrollMonth.slice(4, 6);
            const previousMonth = month === "01" ? "12" : String(Number(month) - 1).padStart(2, '0');
            const previousYear = month === "01" ? String(Number(year) - 1) : year;
            const formattedPreviousMonth = `${previousYear}${previousMonth}`;
            const payrollMonths = [payrollMonth, formattedPreviousMonth];
            const allData = [];
            for (const month of payrollMonths) {
                const monthData = await this.payrollRecordsRepo.getPayrollComparisonRepo({ payrollMonth: month, employeeId });
                allData.push(...monthData);
            }
            const groupedData = allData.reduce((acc, record) => {
                const { employeeId } = record;
                if (!acc[employeeId]) acc[employeeId] = [];
                acc[employeeId].push(record);
                return acc;
            }, {} as Record<number, any[]>);
            const comparisonReport = Object.values(groupedData)
                .map((records: any[]) => {
                    if (records.length === 2) {
                        const [currentData, previousData] = records[0].payrollMonth === payrollMonth
                            ? [records[0], records[1]]
                            : [records[1], records[0]];
                        const employeeId = currentData.employeeId;
                        const name = currentData.name;
                        const comparison: Record<string, any> = {};
                        for (const key of Object.keys(currentData)) {
                            if (!["employeeId", "name", "payrollMonth", "id"].includes(key)) {
                                const currentValue = currentData[key] !== null ? parseFloat(currentData[key]?.toString().replace(/"/g, '')) || 0 : 0;
                                const previousValue = previousData[key] !== null ? parseFloat(previousData[key]?.toString().replace(/"/g, '')) || 0 : 0;
                                comparison[key] = {
                                    currentMonth: currentValue,
                                    previousMonth: previousValue,
                                    difference: currentValue - previousValue,
                                };
                            }
                        }
                        return { employeeId, name, comparison };
                    }
                    return null;
                })
                .filter(Boolean)
            return new CommonResponseModel(true, 1, "Data Found", comparisonReport);
        } catch (error) {
            console.error("Error generating payroll comparison report:", error);
            return new CommonResponseModel(false, 0, "No Data Found");
        }
    }


    async generateEmpPayrollRecords(): Promise<CommonResponseModel> {
        try {
            // Fetch employees and components
            const response = await this.empOnboardingService.getAllActiveEmpForAttendances();

            // Result array to store employee payroll records
            const payrollRecords: PayrollRecordsEntity[] = [];
            let components: any;
            // Process each employee
            for (const emp of response.data) {
                console.log("Processing employee", emp);
                let grossAmount: number;
                let variables: {};
                if (emp.employeeTypeName === 'EMPLOYEE') {
                    components = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 1, branchId: emp.branchId } });

                    if (!components.lwngth) {
                        continue;
                    }
                    if (emp.salary == null || emp.salary < 0) {
                        console.warn(`Salary not found for employee ID: ${emp.id}`);
                        continue; // Skip if no GROSS component
                    }

                    console.log(emp.salary)
                    grossAmount = emp.salary;
                    variables = { GROSS: grossAmount }; // Variable map for formula parsing
                    // Object to hold calculated component amounts
                    let employeeComponents = {};
                    let totalAmount = 0;
                    let pfEligible;
                    let esicEligible;
                    for (const component of components) {
                        if (component.type === TypeEnum.RECURRING && component.isDerived && component.componentType === ComponentTypeEnum.EARNING) {
                            try {
                                const formula = component.derivedRule;

                                // Function to calculate the amount
                                const calculateAmount = (formula, variables) => {
                                    console.log(formula, variables);
                                    let parsedFormula = formula;
                                    for (const [key, value] of Object.entries(variables)) {
                                        const regex = new RegExp(`\\b${key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "g");
                                        parsedFormula = parsedFormula.replace(regex, value.toString());
                                    }
                                    parsedFormula = parsedFormula.replace(/(\d+(\.\d+)?)%/g, (_, percentage) => (Number(percentage) / 100).toString());

                                    // Use a safer evaluation method instead of eval
                                    // e.g., mathjs or other expression evaluators
                                    return eval(parsedFormula); // Replace this with a safer alternative
                                };

                                const compAmount = calculateAmount(formula, variables);
                                totalAmount += compAmount;
                                employeeComponents[component.componentName] = Number(compAmount).toFixed(0); // Add to employee record
                            } catch (error) {
                                console.error(`Error calculating component "${component.componentName}" for employee ID: ${emp.employeeId}`, error);
                            }
                        } else if (component.type === 'RECURRING' && !component.isDerived && component.componentType === ComponentTypeEnum.EARNING) {
                            if (component.componentName === 'CHILD EDU' || component.componentName === 'CHILD EDUCATION') {
                                employeeComponents[component.componentName] = Number(component.calculatedRule).toFixed(0); // Add to employee record
                                totalAmount += Number(component.calculatedRule)
                            } else if (component.componentName === 'SPL PAY') {
                                employeeComponents[component.componentName] = Number(0).toFixed(2); // Add to employee record
                            } else if (component.componentName == 'Mess Allowance') {
                                employeeComponents[component.componentName] = Number(Number(emp.messAllowance) * 30).toFixed(0); // Add to employee record
                            } else if (component.componentName == 'Petrol Allowance') {
                                employeeComponents[component.componentName] = 0; // Add to employee record
                            }
                        }
                    }
                    employeeComponents['SPL PAY'] = Number(grossAmount - totalAmount).toFixed(0);
                    if (emp.isPfEligible == 'YES' || emp.isPfEligible == 'Yes') {
                        pfEligible = 'YES'
                        employeeComponents['PF-Employee'] = Number(employeeComponents['BASIC'] * 12 / 100) < 1800 ? Number(employeeComponents['BASIC'] * 12 / 100).toFixed(0) : 1800;
                        employeeComponents['PF-Employer'] = Number(employeeComponents['BASIC'] * 12 / 100) < 1800 ? Number(employeeComponents['BASIC'] * 12 / 100).toFixed(0) : 1800;
                    } else {
                        employeeComponents['PF-Employee'] = 0;
                        employeeComponents['PF-Employer'] = 0;
                        pfEligible = 'NO'
                    }
                    if (emp.isEsicEligible == 'YES' || emp.isEsicEligible == 'Yes') {
                        esicEligible = 'YES'
                        employeeComponents['ESI-Employee'] = Number(grossAmount * 0.75 / 100).toFixed(0);
                        employeeComponents['ESI-Employer'] = Number(grossAmount * 0.75 / 100).toFixed(0);
                    } else {
                        employeeComponents['ESI-Employee'] = 0;
                        employeeComponents['ESI-Employer'] = 0;
                        esicEligible = 'NO'
                    }
                    const finalComponents = { ...employeeComponents, GROSS: grossAmount }; // Add GROSS to calculated components
                    // Add the calculated components to the result
                    const payrollRecord = new PayrollRecordsEntity();
                    payrollRecord.employeeId = emp.employeeId; // Link to employee
                    payrollRecord.payRollComponents = components[0]; // Link to component
                    payrollRecord.componentRecords = finalComponents; // Add calculated components to record
                    payrollRecord.isPf = pfEligible;
                    payrollRecord.isEsi = esicEligible;
                    payrollRecord.isAttnIncentive = emp.isAttnIncentive;
                    payrollRecord.maxAbDays = emp.maxAbDays;
                    payrollRecord.incentiveDays = emp.incentiveDays;
                    payrollRecord.employeeTypeId = emp.employeeTypeId;
                    payrollRecord.payMode = emp.payMode;
                    payrollRecords.push(payrollRecord);
                    const data = await this.payrollRecordsRepo.findOne({ where: { employeeId: emp.employeeId, isActive: true } });
                    if (data) {
                        const update = await this.payrollRecordsRepo.update({ employeeId: emp.employeeId, isActive: true }, {
                            componentRecords: finalComponents, isPf: pfEligible, isEsi: esicEligible, isAttnIncentive: emp.isAttnIncentive, maxAbDays: emp.maxAbDays, incentiveDays: emp.incentiveDays, employeeTypeId: emp.employeeTypeId, payMode: emp.payMode
                        });
                        if (update.affected > 0) {
                            console.log('Data Updated Successfully');
                        }
                    } else {
                        const save = await this.payrollRecordsRepo.save(payrollRecord);
                    }
                } else {
                    components = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 2, branchId: emp.branchId } });

                    if (emp.salary == null || emp.salary < 0) {
                        console.warn(`PER DAY amount not found for employee ID: ${emp.employeeId}`);
                        continue; // Skip if no GROSS component
                    }
                    // console.log(emp.salary)
                    grossAmount = emp.salary;
                    variables = { GROSS: grossAmount }; // Variable map for formula parsing

                    // Object to hold calculated component amounts
                    let employeeComponents = {};
                    let totalAmount = 0;
                    let pfEligible, esicEligible;

                    // Calculate monthly salary
                    const monthlySalary = Number(emp.salary) * 30;
                    const messAllowance = Number(emp.messAllowance) * 30;

                    // Per Day Salary
                    employeeComponents['PER DAY'] = Number(emp.salary).toFixed(2);

                    // Mess Allowance
                    employeeComponents['Mess Allowance'] = messAllowance.toFixed(2);

                    // PF Calculation
                    if (emp.isPfEligible == 'YES' || emp.isPfEligible == 'Yes') {
                        pfEligible = 'YES';
                        const pfAmount = (monthlySalary * 12) / 100;
                        employeeComponents['PF-Employee'] = pfAmount < 1800 ? pfAmount.toFixed(0) : 1800;
                        employeeComponents['PF-Employer'] = pfAmount < 1800 ? pfAmount.toFixed(0) : 1800;
                    } else {
                        employeeComponents['PF-Employee'] = 0;
                        employeeComponents['PF-Employer'] = 0;
                        pfEligible = 'NO';
                    }

                    // ESI Calculation
                    if (emp.isEsicEligible == 'YES' || emp.isEsicEligible == 'Yes') {
                        esicEligible = 'YES';
                        employeeComponents['ESI-Employee'] = ((monthlySalary * 0.75) / 100).toFixed(0);
                        employeeComponents['ESI-Employer'] = ((monthlySalary * 0.75) / 100).toFixed(0);
                    } else {
                        employeeComponents['ESI-Employee'] = 0;
                        employeeComponents['ESI-Employer'] = 0;
                        esicEligible = 'NO';
                    }

                    // Finalize Components
                    const finalComponents = { ...employeeComponents };
                    // Add the calculated components to the result
                    const payrollRecord = new PayrollRecordsEntity();
                    payrollRecord.employeeId = emp.employeeId; // Link to employee
                    payrollRecord.payRollComponents = components[0]; // Link to component
                    payrollRecord.componentRecords = finalComponents; // Add calculated components to record
                    payrollRecord.isPf = pfEligible;
                    payrollRecord.isEsi = esicEligible;
                    payrollRecord.isAttnIncentive = emp.isAttnIncentive;
                    payrollRecord.maxAbDays = emp.maxAbDays;
                    payrollRecord.incentiveDays = emp.incentiveDays;
                    payrollRecord.employeeTypeId = emp.employeeTypeId;
                    payrollRecord.payMode = emp.payMode;
                    payrollRecords.push(payrollRecord);
                    const data = await this.payrollRecordsRepo.findOne({ where: { employeeId: emp.employeeId, isActive: true } });
                    if (data) {
                        const update = await this.payrollRecordsRepo.update({ employeeId: emp.employeeId, isActive: true }, { componentRecords: finalComponents, isPf: pfEligible, isEsi: esicEligible, isAttnIncentive: emp.isAttnIncentive, maxAbDays: emp.maxAbDays, incentiveDays: emp.incentiveDays, employeeTypeId: emp.employeeTypeId, payMode: emp.payMode });
                        if (update.affected > 0) {
                            console.log('Data Updated Successfully');
                        }
                    } else {
                        const save = await this.payrollRecordsRepo.save(payrollRecord);
                    }
                }
            }
            // Return success response with calculated data
            return new CommonResponseModel(true, 1, "Data Retrieved Successfully");
        } catch (err) {
            console.error("Error in generateEmpPayrollRecords:", err);
            return new CommonResponseModel(false, 1, "An error occurred", err);
        }
    }

    async generateEmpPayrollRecordsForBranch(req: any): Promise<CommonResponseModel> {
        try {
            // Fetch employees and components
            const response = await this.empOnboardingService.getEmpDetailsByBranch({ branchId: req.branchId });
            console.log(response.data)
            // Result array to store employee payroll records
            const payrollRecords: PayrollRecordsEntity[] = [];
            let components: any;
            // Process each employee
            for (const emp of response.data) {
                let grossAmount: number;
                let variables: {};
                if (emp.employeeTypeName === 'EMPLOYEE') {
                    components = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 1, branchId: emp.branchId } });

                    // Find the "GROSS" component
                    // const grossComponent = components.find(item => item.componentName === "GROSS");
                    // if (!grossComponent) {
                    //     return new CommonResponseModel(false, 1, '"GROSS" component not found', []);
                    // }

                    // Fetch GROSS amount for the employee
                    // const recComp = await this.employeeRecComponentsRepo.findOne({
                    //     where: { employeeId: emp.employeeId, componentId: grossComponent.id },
                    // });

                    if (emp.salary == null || emp.salary < 0) {
                        console.warn(`Salary not found for employee ID: ${emp.id}`);
                        continue; // Skip if no GROSS component
                    }

                    console.log(emp.salary)
                    grossAmount = emp.salary;
                    variables = { GROSS: grossAmount }; // Variable map for formula parsing
                    // Object to hold calculated component amounts
                    let employeeComponents = {};
                    let totalAmount = 0;
                    let pfEligible;
                    let esicEligible;
                    for (const component of components) {
                        if (component.type === TypeEnum.RECURRING && component.isDerived && component.componentType === ComponentTypeEnum.EARNING) {
                            try {
                                const formula = component.derivedRule;

                                // Function to calculate the amount
                                const calculateAmount = (formula, variables) => {
                                    console.log(formula, variables);
                                    let parsedFormula = formula;
                                    for (const [key, value] of Object.entries(variables)) {
                                        const regex = new RegExp(`\\b${key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "g");
                                        parsedFormula = parsedFormula.replace(regex, value.toString());
                                    }
                                    parsedFormula = parsedFormula.replace(/(\d+(\.\d+)?)%/g, (_, percentage) => (Number(percentage) / 100).toString());

                                    // Use a safer evaluation method instead of eval
                                    // e.g., mathjs or other expression evaluators
                                    return eval(parsedFormula); // Replace this with a safer alternative
                                };

                                const compAmount = calculateAmount(formula, variables);
                                totalAmount += compAmount;
                                employeeComponents[component.componentName] = Number(compAmount).toFixed(0); // Add to employee record
                            } catch (error) {
                                console.error(`Error calculating component "${component.componentName}" for employee ID: ${emp.employeeId}`, error);
                            }
                        } else if (component.type === 'RECURRING' && !component.isDerived && component.componentType === ComponentTypeEnum.EARNING) {
                            if (component.componentName === 'CHILD EDU' || component.componentName === 'CHILD EDUCATION') {
                                employeeComponents[component.componentName] = Number(component.calculatedRule).toFixed(0); // Add to employee record
                                totalAmount += Number(component.calculatedRule)
                            } else if (component.componentName === 'SPL PAY') {
                                employeeComponents[component.componentName] = Number(0).toFixed(2); // Add to employee record
                            } else if (component.componentName == 'Mess Allowance') {
                                employeeComponents[component.componentName] = Number(Number(emp.messAllowance) * 30).toFixed(0); // Add to employee record
                            } else if (component.componentName == 'Petrol Allowance') {
                                employeeComponents[component.componentName] = 0; // Add to employee record
                            }
                        }
                    }
                    employeeComponents['SPL PAY'] = Number(grossAmount - totalAmount).toFixed(0);
                    if (emp.isPfEligible === 'YES' || emp.isPfEligible == 'Yes') {
                        pfEligible = 'YES'
                        employeeComponents['PF-Employee'] = Number(employeeComponents['BASIC'] * 12 / 100) < 1800 ? Number(employeeComponents['BASIC'] * 12 / 100).toFixed(0) : 1800;
                        employeeComponents['PF-Employer'] = Number(employeeComponents['BASIC'] * 12 / 100) < 1800 ? Number(employeeComponents['BASIC'] * 12 / 100).toFixed(0) : 1800;
                    } else {
                        employeeComponents['PF-Employee'] = 0;
                        employeeComponents['PF-Employer'] = 0;
                        pfEligible = 'NO'
                    }
                    if (emp.isEsicEligible === 'YES' || emp.isEsicEligible == 'Yes') {
                        esicEligible = 'YES'
                        employeeComponents['ESI-Employee'] = Number(grossAmount * 0.5 / 100).toFixed(0);
                        employeeComponents['ESI-Employer'] = Number(grossAmount * 0.5 / 100).toFixed(0);

                    } else {
                        employeeComponents['ESI-Employee'] = 0;
                        employeeComponents['ESIEmployer'] = 0;
                        esicEligible = 'NO'
                    }
                    const finalComponents = { ...employeeComponents, GROSS: grossAmount }; // Add GROSS to calculated components
                    // Add the calculated components to the result
                    const payrollRecord = new PayrollRecordsEntity();
                    payrollRecord.employeeId = emp.employeeId; // Link to employee
                    payrollRecord.payRollComponents = components[0]; // Link to component
                    payrollRecord.componentRecords = finalComponents; // Add calculated components to record
                    payrollRecord.isPf = pfEligible;
                    payrollRecord.isEsi = esicEligible;
                    payrollRecord.isAttnIncentive = emp.isAttnIncentive;
                    payrollRecord.maxAbDays = emp.maxAbDays;
                    payrollRecord.incentiveDays = emp.incentiveDays;
                    payrollRecord.employeeTypeId = emp.employeeTypeId;
                    payrollRecord.payMode = emp.payMode;
                    payrollRecords.push(payrollRecord);
                    const data = await this.payrollRecordsRepo.findOne({ where: { employeeId: emp.employeeId, isActive: true } });
                    if (data) {
                        const update = await this.payrollRecordsRepo.update({ employeeId: emp.employeeId, isActive: true }, { componentRecords: finalComponents, isPf: pfEligible, isEsi: esicEligible, isAttnIncentive: emp.isAttnIncentive, maxAbDays: emp.maxAbDays, incentiveDays: emp.incentiveDays, employeeTypeId: emp.employeeTypeId, payMode: emp.payMode });
                        if (update.affected > 0) {
                            console.log('Data Updated Successfully');
                        }
                    } else {
                        const save = await this.payrollRecordsRepo.save(payrollRecord);
                    }
                } else {
                    components = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 2, branchId: emp.branchId } });
                    // Find the "PER DAY" component
                    // const perDay = components.find(item => item.componentName === "PER DAY");
                    // if (!perDay) {
                    //     return new CommonResponseModel(false, 1, '"PER DAY" component not found', []);
                    // }
                    // const recComp = await this.employeeRecComponentsRepo.findOne({
                    //     where: { employeeId: emp.employeeId, componentId: perDay.id },
                    // });

                    if (emp.salary == null || emp.salary < 0) {
                        console.warn(`PER DAY amount not found for employee ID: ${emp.employeeId}`);
                        continue; // Skip if no GROSS component
                    }
                    console.log(emp.salary)
                    grossAmount = emp.salary;
                    variables = { GROSS: grossAmount }; // Variable map for formula parsing

                    // Object to hold calculated component amounts
                    let employeeComponents = {};
                    let totalAmount = 0;
                    let pfEligible;
                    let esicEligible;

                    const monthlySalary = Number(emp.salary) * 30;
                    const messAllowance = Number(emp.messAllowance) * 30;

                    // Per Day Salary
                    employeeComponents['PER DAY'] = Number(emp.salary).toFixed(2);

                    // Mess Allowance
                    employeeComponents['Mess Allowance'] = messAllowance.toFixed(2);

                    if (emp.isPfEligible === 'YES' || emp.isPfEligible === 'Yes') {
                        pfEligible = 'YES'
                        const pfAmount = (monthlySalary * 12) / 100;
                        employeeComponents['PF-Employee'] = pfAmount < 1800 ? pfAmount.toFixed(0) : 1800;
                        employeeComponents['PF-Employer'] = pfAmount < 1800 ? pfAmount.toFixed(0) : 1800;
                    } else {
                        employeeComponents['PF-Employee'] = 0;
                        employeeComponents['PF-Employer'] = 0;
                        pfEligible = 'NO'
                    }
                    if (emp.isEsicEligible === 'YES' || emp.isEsicEligible === 'Yes') {
                        esicEligible = 'YES'
                        employeeComponents['ESI-Employee'] = ((monthlySalary * 0.75) / 100).toFixed(0);
                        employeeComponents['ESI-Employer'] = ((monthlySalary * 0.75) / 100).toFixed(0);
                    } else {
                        employeeComponents['ESI-Employee'] = 0;
                        employeeComponents['ESI-Employer'] = 0;
                        esicEligible = 'NO'
                    }
                    const finalComponents = { ...employeeComponents }; // Add GROSS to calculated components
                    // Add the calculated components to the result
                    const payrollRecord = new PayrollRecordsEntity();
                    payrollRecord.employeeId = emp.employeeId; // Link to employee
                    payrollRecord.payRollComponents = components[0]; // Link to component
                    payrollRecord.componentRecords = finalComponents; // Add calculated components to record
                    payrollRecord.isPf = pfEligible;
                    payrollRecord.isEsi = esicEligible;
                    payrollRecord.isAttnIncentive = emp.isAttnIncentive;
                    payrollRecord.maxAbDays = emp.maxAbDays;
                    payrollRecord.incentiveDays = emp.incentiveDays;
                    payrollRecord.employeeTypeId = emp.employeeTypeId;
                    payrollRecord.payMode = emp.payMode;
                    payrollRecords.push(payrollRecord);
                    const data = await this.payrollRecordsRepo.findOne({ where: { employeeId: emp.employeeId, isActive: true } });
                    if (data) {
                        const update = await this.payrollRecordsRepo.update({ employeeId: emp.employeeId, isActive: true }, { componentRecords: finalComponents, isPf: pfEligible, isEsi: esicEligible, isAttnIncentive: emp.isAttnIncentive, maxAbDays: emp.maxAbDays, incentiveDays: emp.incentiveDays, employeeTypeId: emp.employeeTypeId, payMode: emp.payMode });
                        if (update.affected > 0) {
                            console.log('Data Updated Successfully');
                        }
                    } else {
                        const save = await this.payrollRecordsRepo.save(payrollRecord);
                    }
                }
            }
            // Return success response with calculated data
            return new CommonResponseModel(true, 1, "Data Retrieved Successfully");
        } catch (err) {
            console.error("Error in generateEmpPayrollRecords:", err);
            return new CommonResponseModel(false, 1, "An error occurred", err);
        }
    }

    async generateEmpPayrollRecordsByEmpId(req: any): Promise<CommonResponseModel> {
        try {
            console.log(req, "req")
            // Fetch employees and components
            const response = await this.empOnboardingService.getEmpById({ employeeId: req.employeeId });
            const emp = response.data
            // Result array to store employee payroll records
            const payrollRecords: PayrollRecordsEntity[] = [];
            let components: any;

            let grossAmount: number;
            let variables: {};
            if (emp.employeeType === 'EMPLOYEE') {
                components = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 1 } });

                if (emp.salary == null || emp.salary < 0) {
                    console.warn(`Salary not found for employee ID: ${emp.id}`);
                }

                console.log(emp.salary)
                grossAmount = emp.salary;
                variables = { GROSS: grossAmount }; // Variable map for formula parsing
                // Object to hold calculated component amounts
                let employeeComponents = {};
                let totalAmount = 0;
                let pfEligible;
                let esicEligible;
                for (const component of components) {
                    if (component.type === TypeEnum.RECURRING && component.isDerived && component.componentType === ComponentTypeEnum.EARNING) {
                        try {
                            const formula = component.derivedRule;

                            // Function to calculate the amount
                            const calculateAmount = (formula, variables) => {
                                // console.log(formula, variables);
                                let parsedFormula = formula;
                                for (const [key, value] of Object.entries(variables)) {
                                    const regex = new RegExp(`\\b${key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "g");
                                    parsedFormula = parsedFormula.replace(regex, value.toString());
                                }
                                parsedFormula = parsedFormula.replace(/(\d+(\.\d+)?)%/g, (_, percentage) => (Number(percentage) / 100).toString());

                                // Use a safer evaluation method instead of eval
                                // e.g., mathjs or other expression evaluators
                                return eval(parsedFormula); // Replace this with a safer alternative
                            };

                            const compAmount = calculateAmount(formula, variables);
                            totalAmount += compAmount;
                            employeeComponents[component.componentName] = Number(compAmount).toFixed(2); // Add to employee record
                        } catch (error) {
                            console.error(`Error calculating component "${component.componentName}" for employee ID: ${emp.employeeId}`, error);
                        }
                    } else if (component.type === 'RECURRING' && !component.isDerived && component.componentType === ComponentTypeEnum.EARNING) {
                        if (component.componentName === 'CHILD EDU') {
                            employeeComponents[component.componentName] = Number(component.calculatedRule).toFixed(2); // Add to employee record
                            totalAmount += Number(component.calculatedRule)
                        } else if (component.componentName === 'SPL PAY') {
                            employeeComponents[component.componentName] = Number(0).toFixed(2); // Add to employee record
                        } else if (component.componentName == 'Mess Allowance') {
                            employeeComponents[component.componentName] = Number(Number(emp.messAllowance) * 30).toFixed(2); // Add to employee record
                        } else if (component.componentName == 'Petrol Allowance') {
                            employeeComponents[component.componentName] = 0; // Add to employee record
                        }
                    }
                }
                employeeComponents['SPL PAY'] = Number(grossAmount - totalAmount).toFixed(0);
                if (emp.isPfEligible == 'YES' || emp.isPfEligible == 'Yes') {
                    pfEligible = 'YES'
                    employeeComponents['PF-Employee'] = Number(employeeComponents['BASIC'] * 12 / 100) < 1800 ? Number(employeeComponents['BASIC'] * 12 / 100).toFixed(0) : 1800;
                    employeeComponents['PF-Employer'] = Number(employeeComponents['BASIC'] * 12 / 100) < 1800 ? Number(employeeComponents['BASIC'] * 12 / 100).toFixed(0) : 1800;
                } else {
                    employeeComponents['PF-Employee'] = 0;
                    employeeComponents['PF-Employer'] = 0;
                    pfEligible = 'NO'
                }
                if (emp.isEsicEligible == 'YES' || emp.isEsicEligible == 'Yes') {
                    esicEligible = 'YES'
                    employeeComponents['ESI-Employee'] = Number(grossAmount * 0.75 / 100).toFixed(0);
                    employeeComponents['ESI-Employer'] = Number(grossAmount * 0.75 / 100).toFixed(0);
                } else {
                    employeeComponents['ESI-Employee'] = 0;
                    employeeComponents['ESI-Employer'] = 0;
                    esicEligible = 'NO'
                }
                const finalComponents = { ...employeeComponents, GROSS: grossAmount }; // Add GROSS to calculated components
                // Add the calculated components to the result
                const payrollRecord = new PayrollRecordsEntity();
                payrollRecord.employeeId = emp.employeeId; // Link to employee
                payrollRecord.payRollComponents = components[0]; // Link to component
                payrollRecord.componentRecords = finalComponents; // Add calculated components to record
                payrollRecord.isPf = pfEligible;
                payrollRecord.isEsi = esicEligible;
                payrollRecord.isAttnIncentive = emp.isAttnIncentive;
                payrollRecord.maxAbDays = emp.maxAbDays;
                payrollRecord.incentiveDays = emp.incentiveDays;
                payrollRecord.employeeTypeId = emp.employeeTypeId;
                payrollRecord.payMode = emp.payMode;
                payrollRecords.push(payrollRecord);
                const data = await this.payrollRecordsRepo.findOne({ where: { employeeId: emp.employeeId, isActive: true } });
                if (data) {
                    const update = await this.payrollRecordsRepo.update({ employeeId: emp.employeeId, isActive: true }, { componentRecords: finalComponents, isPf: pfEligible, isEsi: esicEligible, isAttnIncentive: emp.isAttnIncentive, maxAbDays: emp.maxAbDays, incentiveDays: emp.incentiveDays, employeeTypeId: emp.employeeTypeId, payMode: emp.payMode });
                    if (update.affected > 0) {
                        console.log('Data Updated Successfully');
                    }
                } else {
                    const save = await this.payrollRecordsRepo.save(payrollRecord);
                }
            } else {
                components = await this.payrollComponentsRepo.find({ where: { employeeTypeId: 2 } });

                if (emp.salary == null || emp.salary < 0) {
                    console.warn(`PER DAY amount not found for employee ID: ${emp.employeeId}`);
                }
                console.log(emp.salary)
                grossAmount = emp.salary;
                variables = { GROSS: grossAmount }; // Variable map for formula parsing

                // Object to hold calculated component amounts
                let employeeComponents = {};
                let totalAmount = 0;
                let pfEligible, esicEligible;

                // Calculate monthly salary
                const monthlySalary = Number(emp.salary) * 30;
                const messAllowance = Number(emp.messAllowance) * 30;

                // Per Day Salary
                employeeComponents['PER DAY'] = Number(emp.salary).toFixed(2);

                // Mess Allowance
                employeeComponents['Mess Allowance'] = messAllowance.toFixed(2);

                // PF Calculation
                if (emp.isPfEligible === 'YES' || emp.isPfEligible === 'Yes') {
                    pfEligible = 'YES';
                    const pfAmount = (monthlySalary * 12) / 100;
                    employeeComponents['PF-Employee'] = pfAmount < 1800 ? pfAmount.toFixed(0) : 1800;
                    employeeComponents['PF-Employer'] = pfAmount < 1800 ? pfAmount.toFixed(0) : 1800;
                } else {
                    employeeComponents['PF-Employee'] = 0;
                    employeeComponents['PF-Employer'] = 0;
                    pfEligible = 'NO';
                }

                // ESI Calculation
                if (emp.isEsicEligible === 'YES' || emp.isEsicEligible === 'Yes') {
                    esicEligible = 'YES';
                    employeeComponents['ESI-Employee'] = ((monthlySalary * 0.75) / 100).toFixed(0);
                    employeeComponents['ESI-Employer'] = ((monthlySalary * 0.75) / 100).toFixed(0);
                } else {
                    employeeComponents['ESI-Employee'] = 0;
                    employeeComponents['ESI-Employer'] = 0;
                    esicEligible = 'NO';
                }

                // Finalize Components
                const finalComponents = { ...employeeComponents };
                // Add the calculated components to the result
                const payrollRecord = new PayrollRecordsEntity();
                payrollRecord.employeeId = emp.employeeId; // Link to employee
                payrollRecord.payRollComponents = components[0]; // Link to component
                payrollRecord.componentRecords = finalComponents; // Add calculated components to record
                payrollRecord.isPf = pfEligible;
                payrollRecord.isEsi = esicEligible;
                payrollRecord.isAttnIncentive = emp.isAttnIncentive;
                payrollRecord.maxAbDays = emp.maxAbDays;
                payrollRecord.incentiveDays = emp.incentiveDays;
                payrollRecord.employeeTypeId = emp.employeeTypeId;
                payrollRecord.payMode = emp.payMode;
                payrollRecords.push(payrollRecord);
                const data = await this.payrollRecordsRepo.findOne({ where: { employeeId: emp.employeeId, isActive: true } });
                if (data) {
                    const update = await this.payrollRecordsRepo.update({ employeeId: emp.employeeId, isActive: true }, { componentRecords: finalComponents, isPf: pfEligible, isEsi: esicEligible, isAttnIncentive: emp.isAttnIncentive, maxAbDays: emp.maxAbDays, incentiveDays: emp.incentiveDays, employeeTypeId: emp.employeeTypeId, payMode: emp.payMode });
                    if (update.affected > 0) {
                        console.log('Data Updated Successfully');
                    }
                } else {
                    const save = await this.payrollRecordsRepo.save(payrollRecord);
                }
            }
            // Return success response with calculated data
            return new CommonResponseModel(true, 1, "Data Retrieved Successfully", payrollRecords);
        } catch (err) {
            console.error("Error in generateEmpPayrollRecords:", err);
            return new CommonResponseModel(false, 1, "An error occurred", err);
        }
    }

    async getPayrollRecords(req: PayrollProcessedLogDto): Promise<CommonResponseModel> {
        try {
            // const { page = 1, pageSize = 10 } = req; 
            // const offset = (page - 1) * pageSize;

            // const result = await this.payrollRecordsRepository.getPayrollRecordsRepo({
            //     ...req,
            //     offset,
            //     limit: pageSize,
            // });
            const result = await this.payrollRecordsRepo.getPayrollRecordsRepo(req);
            const dynamicColumns = Array.isArray(result) ? result : result.data || [];
            const finalResult = dynamicColumns.map((record: any) => {
                if (record.componentRecords) {
                    try {
                        const parsedComponents = JSON.parse(record.componentRecords);
                        const componentKeys = Object.entries(parsedComponents).map(([key, value]) => ({
                            [key]: value,
                        }));
                        return { ...record, componentKeys };
                    } catch (error) {
                        console.error("Invalid JSON in componentRecords:", record.componentRecords, error);
                        return { ...record, componentKeys: [] };
                    }
                }
                return { ...record, componentKeys: [] };
            });

            return new CommonResponseModel(true, 1, "Data Retrieved", finalResult);
        } catch (err) {
            console.log(err);
            return new CommonResponseModel(false, 0, "Failed");
        }
    }


    async createEmpNonRecurring(req: EmpNonRecurringReq): Promise<CommonResponseModel> {
        const transactionalManager = new GenericTransactionManager(this.dataSource);
        try {
            let done
            await transactionalManager.startTransaction();
            const record = await this.employeeNonRecurringComponentsRepository.find({ where: { employeeId: req.payRollEmployee, componentId: req.payRollComponent, isActive: true } });
            if (record.length === 0 || Number(record[0]?.endDate) < Number(dayjs(req.startDate).format('YYYYMM'))) {
                const entity = new EmpNonRecComponentsEntity();
                entity.employeeId = req.payRollEmployee
                const pId = new PayrollComponentsEntity()
                pId.id = req.payRollComponent
                entity.payRollComponent = pId
                entity.totalAmount = req.totalAmount;
                entity.emiCount = req.emiCount;
                entity.emiAmount = req.emiAmount;
                entity.startDate = dayjs(req.startDate).format('YYYYMM');
                entity.endDate = dayjs(req.endDate).format('YYYYMM');
                entity.createdUser = req.createdUser
                const save = await transactionalManager.getRepository(EmpNonRecComponentsEntity).save(entity)
                if (save) {
                    for (let count = 0; count < req.emiCount; count++) {
                        const termEntity = new EmpNonRecTermsEntity()
                        termEntity.employeeId = req.payRollEmployee
                        const pId = new PayrollComponentsEntity()
                        pId.id = req.payRollComponent
                        termEntity.payRollComponent = pId
                        const EnRId = new EmpNonRecComponentsEntity()
                        EnRId.id = save.id
                        termEntity.empNonRecComponent = EnRId
                        termEntity.totalTerms = req.emiCount;
                        termEntity.termCount = `${count + 1}/${req.emiCount}`;
                        termEntity.termAmount = req.emiAmount
                        termEntity.payMonth = dayjs(req.startDate).add(count, 'month').format('YYYYMM');
                        termEntity.createdUser = req.createdUser
                        await transactionalManager.getRepository(EmpNonRecTermsEntity).save(termEntity)
                    }
                }
                //logs maintaing for create
                const logsEntity = new NonRecTermsLogsEntity()
                logsEntity.employeeId = req.payRollEmployee, logsEntity.componentId = req.payRollComponent, logsEntity.nonRecurringId = save.id
                logsEntity.role = req.createdUser, logsEntity.actionType = ActionTypeEnum.CREATE, logsEntity.updatedValues = entity, logsEntity.updatedUser = req.updatedUser
                const log = await transactionalManager.getRepository(NonRecTermsLogsEntity).save(logsEntity)
                await transactionalManager.completeTransaction();
                done = true
            } else {
                const nonRecEntity = record[0] as EmpNonRecComponentsEntity
                const nre = new EmpNonRecComponentsEntity
                nre.id = nonRecEntity.id
                const terms = await this.employeeNonRecurringTermsRepository.find({ where: { empNonRecComponent: nre, isProcessed: true, isActive: true } });
                if (terms.length === 0) {
                    if (Number(record[0].endDate) > Number(dayjs(req.startDate).format('YYYYMM'))) {
                        const x = await this.employeeNonRecurringComponentsRepository.update(nre, { isActive: false });
                        if (x) {
                            await this.employeeNonRecurringTermsRepository.delete({ empNonRecComponent: nre, isProcessed: false });
                        }
                        const entity = new EmpNonRecComponentsEntity();
                        entity.employeeId = req.payRollEmployee
                        const pId = new PayrollComponentsEntity()
                        pId.id = req.payRollComponent
                        entity.payRollComponent = pId
                        entity.totalAmount = req.totalAmount;
                        entity.emiCount = req.emiCount;
                        entity.emiAmount = req.emiAmount;
                        entity.startDate = dayjs(req.startDate).format('YYYYMM');
                        entity.endDate = dayjs(req.endDate).format('YYYYMM');
                        entity.createdUser = req.createdUser
                        const save = await transactionalManager.getRepository(EmpNonRecComponentsEntity).save(entity)
                        if (save) {
                            for (let count = 0; count < req.emiCount; count++) {
                                const termEntity = new EmpNonRecTermsEntity()
                                termEntity.employeeId = req.payRollEmployee
                                const pId = new PayrollComponentsEntity()
                                pId.id = req.payRollComponent
                                termEntity.payRollComponent = pId
                                const EnRId = new EmpNonRecComponentsEntity()
                                EnRId.id = save.id
                                termEntity.empNonRecComponent = EnRId
                                termEntity.totalTerms = req.emiCount;
                                termEntity.termCount = `${count + 1}/${req.emiCount}`;
                                termEntity.termAmount = req.emiAmount
                                termEntity.payMonth = dayjs(req.startDate).add(count, 'month').format('YYYYMM');
                                termEntity.createdUser = req.createdUser
                                await transactionalManager.getRepository(EmpNonRecTermsEntity).save(termEntity)
                            }
                        }
                        done = true
                    }
                }
            }
            if (done) {
                return new CommonResponseModel(true, 1, "Employees Record Saved Successfully")
            } else {
                return new CommonResponseModel(true, 1, "Employees Record Already in process can't add another")
            }
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            await transactionalManager.releaseTransaction();
            throw err;
        }
    }

    async getEmpNonRecurring(req: EmpNonRecurringRequest): Promise<CommonResponseModel> {
        try {
            const x = await this.employeeNonRecurringComponentsRepository.getEmpNonRecDataRepo(req)
            return new CommonResponseModel(true, 1, 'Data Retrieved successfully', x)
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }


    async updatePayrollCompRecords(req: any): Promise<CommonResponseModel> {
        try {
            const componentRecords = req.componentKeys.reduce((acc, curr) => {
                const [key, value] = Object.entries(curr)[0];
                acc[key] = value;
                return acc;
            }, {});
            const en = new PayrollComponentsEntity()
            en.id = req.component_id
            const update = await this.payrollRecordsRepo.update({ employeeId: req.employeeId, payRollComponents: en, isActive: true }, { isActive: false })
            let save
            if (update) {
                const entity = new PayrollRecordsEntity()
                entity.employeeId = req.employeeId
                entity.payRollComponents = en
                entity.componentRecords = componentRecords
                entity.isDerived = req.isDerived
                entity.isAttnIncentive = req.incentive
                entity.status = req.isPending
                save = await this.payrollRecordsRepo.save(entity)
            }
            if (update.affected > 0 && save) {
                return new CommonResponseModel(true, 1, 'Updated successfully', update);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async saveEmployeeNonRecComponent(req: any): Promise<CommonResponseModel> {
        console.log(req, "req non rec")
        const formatedFromData = dayjs(req.fromDate).format('YYYYMM')
        console.log(formatedFromData, "formatedFromData")
        const numberOfTermsCount = req.termsCount
        const numberOfTotalTerms = req.totalTerms
        try {
            const entity = new EmpNonRecComponentsEntity();
            console.log('--------ded no-----------')
            entity.totalAmount = req.amount;
            entity.emiCount = Number(req.totalTerms);
            entity.emiAmount = req.amount;
            entity.employeeId = req.employeeId;
            entity.componentId = req.componentId;
            entity.startDate = formatedFromData.replace(/-/g, "");
            const totalMonthsToAdd = (numberOfTotalTerms - numberOfTermsCount) + 1;
            let startYear = parseInt(entity.startDate.substring(0, 4));
            let startMonth = parseInt(entity.startDate.substring(4, 6));
            let months = [];
            for (let i = 0; i < totalMonthsToAdd; i++) {
                months.push(`${startYear}${(startMonth < 10 ? '0' : '') + startMonth}`);
                startMonth++;
                if (startMonth > 12) {
                    startMonth = 1;
                    startYear++;
                }
            }
            const endDate = months[months.length - 1];
            entity.endDate = endDate
            console.log(entity, '-------entity--------')
            const save = await this.employeeNonRecurringComponentsRepository.save(entity)
            if (save) {
                for (let jj = 0; jj < months.length; jj++) {
                    const nonRecTermsEntity = new EmpNonRecTermsEntity();
                    const EnRId = new EmpNonRecComponentsEntity()
                    EnRId.id = save.id
                    nonRecTermsEntity.empNonRecComponent = EnRId
                    nonRecTermsEntity.employeeId = req.employeeId;
                    nonRecTermsEntity.componentId = req.componentId;
                    nonRecTermsEntity.termAmount = req.amount;
                    nonRecTermsEntity.payMonth = months[jj];
                    nonRecTermsEntity.totalTerms = numberOfTotalTerms;
                    nonRecTermsEntity.termCount = `${jj + 1}/${numberOfTotalTerms}`;
                    await this.employeeNonRecurringTermsRepository.save(nonRecTermsEntity)
                }
                return new CommonResponseModel(true, 1, 'Data saved successfully');
            } else {
                console.log("Not Saved");
            }
        } catch (err) {
            // await transactionalManager.releaseTransaction();
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }


    async updateEmpNonRecurring(req: EmpNonRecurringUpdateReq): Promise<CommonResponseModel> {
        const transactionalManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionalManager.startTransaction();
            const enc = new EmpNonRecComponentsEntity
            enc.id = req.id
            const processedCount = await transactionalManager.getRepository(EmpNonRecTermsEntity).find({ where: { empNonRecComponent: enc, isProcessed: true } })
            const updateData: any = {
                endDate: dayjs(req.endDate).format('YYYYMM'),
                emiAmount: req.emiAmount,
                emiCount: req.emiCount + processedCount.length,
            }
            if (processedCount.length === 0) {
                updateData.startDate = dayjs(req.currentDate).format('YYYYMM')
            }
            const previousData = await transactionalManager.getRepository(EmpNonRecComponentsEntity).find({ where: { id: req.id } }) //to get previous data for maintain logs
            const save = await transactionalManager.getRepository(EmpNonRecComponentsEntity).update({ id: req.id }, updateData)
            if (save) {
                const EnRId = new EmpNonRecComponentsEntity()
                EnRId.id = req.id
                await transactionalManager.getRepository(EmpNonRecTermsEntity).delete(
                    { empNonRecComponent: EnRId, isProcessed: false }
                );
            }
            //for terms
            if (save) {
                for (let count = 0; count < req.emiCount; count++) {
                    const termEntity = new EmpNonRecTermsEntity()
                    const eId = new PayrollEmployeesEntity()
                    eId.id = req.payRollEmployee
                    termEntity.payRollEmployee = eId
                    const pId = new PayrollComponentsEntity()
                    pId.id = req.payRollComponent
                    termEntity.payRollComponent = pId
                    const EnRId = new EmpNonRecComponentsEntity()
                    EnRId.id = req.id
                    termEntity.empNonRecComponent = EnRId
                    termEntity.totalTerms = req.emiCount;
                    termEntity.termCount = `${count + 1}/${req.emiCount}`;
                    termEntity.termAmount = req.emiAmount
                    termEntity.payMonth = dayjs(req.currentDate).add(count, 'month').format('YYYYMM');
                    await transactionalManager.getRepository(EmpNonRecTermsEntity).save(termEntity)
                }
            }
            //logs maintaing for update
            const logsEntity = new NonRecTermsLogsEntity()
            logsEntity.employeeId = req.payRollEmployee, logsEntity.componentId = req.payRollComponent, logsEntity.nonRecurringId = req.id
            logsEntity.role = req.createdUser, logsEntity.actionType = ActionTypeEnum.UPDATE, logsEntity.previousValues = previousData, logsEntity.updatedValues = updateData, logsEntity.updatedUser = req.updatedUser
            const log = await transactionalManager.getRepository(NonRecTermsLogsEntity).save(logsEntity)
            await transactionalManager.completeTransaction();
            return new CommonResponseModel(true, 1, 'Data saved successfully', save)
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            await transactionalManager.releaseTransaction();
            throw err;
        }
    }

    async getAllPayrollRecords(req: PayrollReq): Promise<CommonResponseModel> {
        try {
            const data = await this.payrollRecordsRepo.getAllPayrollRecords(req)
            if (data) {
                return new CommonResponseModel(true, 1, 'Data Retried successfully', data)
            } else {
                return new CommonResponseModel(false, 0, 'No Data Found', [])
            }

        } catch (err) {
            console.error(err)
        }
    }
    async getAllPayrollRecordsData(req?: any): Promise<CommonResponseModel> {
        try {
            const data = await this.payrollRecordsRepo.getRequestedPayrollRecordsData(req)
            if (data) {
                return new CommonResponseModel(true, 1, 'Data Retried successfully', data)
            } else {
                return new CommonResponseModel(false, 0, 'No Data Found', [])
            }

        } catch (err) {
            console.error(err)
        }
    }

    async getAllPayrollComponentsData(req?: any): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollTypeComponentsRepository.getAllPayrollComponents()
            if (result) {
                return new CommonResponseModel(true, 1, "Data Got ...", result)
            } else {
                return new CommonResponseModel(false, 0, "Data Got Error...")
            }
        } catch (err) {
            console.error('Error Getting Data:', err);
            throw err;
        }
    }

    async updateAutomaticallyValue(req?: any): Promise<CommonResponseModel> {
        try {
            const payRollsData = await this.getAllPayrollComponentsData();
            const payRollData = payRollsData.data.data;
            const recordsData = await this.getAllPayrollRecordsData();
            const recordData = recordsData.data;
            const derivedRecords = recordData.filter(record => record.isDerived === 1 && record.employeeTypeId === req.employeeTypeId && record.branchId === req.branchId);
            let formattedDerivedRuleData = [];
            if (derivedRecords.length > 0) {
                formattedDerivedRuleData = payRollData.map((f) => {
                    if (f.derivedRule) {
                        const derivedRuleParts = f.derivedRule.split('*');
                        if (derivedRuleParts.length === 2 && derivedRuleParts[1].trim() !== '') {
                            return `${f.empType}-${f.componentName}-${derivedRuleParts[1].trim()}`;
                        }
                    }
                    return null;
                }).filter(Boolean);
            } else {
                console.log("No Record With Is Derived 1");
            }
            const updatedDerivedRecords = await Promise.all(derivedRecords.map(async (record) => {
                const componentRecordsData = JSON.parse(record.componentRecords)
                const grossKey = Object.keys(componentRecordsData).find(key =>
                    /^(GROSS|Gross|gross)$/.test(key)
                );
                if (grossKey) {
                    const grossValue = parseFloat(componentRecordsData[grossKey]);
                    formattedDerivedRuleData.forEach((rule) => {
                        const [empType, componentName, deductionPercent] = rule.split('-');
                        const deduction = parseFloat(deductionPercent) / 100;
                        if (record.employeeTypeName === empType && componentRecordsData.hasOwnProperty(componentName)) {
                            const deductedValue = grossValue * deduction;
                            const updatedValue = grossValue - deductedValue;
                            componentRecordsData[componentName] = updatedValue.toFixed(2);
                        }
                    });

                    componentRecordsData[grossKey] = grossValue.toFixed(2);
                }
                record.componentRecords = componentRecordsData
                return record;
            }));

            for (const updatedRecord of updatedDerivedRecords) {
                await this.payrollRecordsRepo.update(
                    {
                        employeeId: updatedRecord.employeeId,
                        isDerived: updatedRecord.isDerived
                    },
                    { componentRecords: updatedRecord.componentRecords }
                );
            }

            return new CommonResponseModel(true, 1, "Derived Values updated", updatedDerivedRecords)
        } catch (err) {
            console.log(err, "Error in updating values");
            return new CommonResponseModel(false, 0, "Error in updating values", [], []);
        }
    }

    async getTermLogs(req: any): Promise<CommonResponseModel> {
        try {
            const x = await this.employeeNonRecurringLogsRepository.getTermLogs(req)
            return new CommonResponseModel(true, 1, 'Data Retrieved successfully', x)
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }

    async updatePayrollRecordsFromEmployee(req: any): Promise<CommonResponseModel> {
        try {
            const componentRecordsData = req.componentKeys.reduce((acc, curr) => {
                const [key, value] = Object.entries(curr)[0];
                acc[key] = value;
                return acc;
            }, {});
            const update = await this.payrollRecordsRepo.update({ employeeId: req.id }, { componentRecords: componentRecordsData, status: req.isPending, isAttnIncentive: req.incentive, isDerived: req.isDerived })
            if (update.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully');
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

}


