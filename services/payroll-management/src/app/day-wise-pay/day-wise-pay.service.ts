// src/services/master.service.ts
import { CommonResponseModel } from '@hrexpert/backend-utils';
import { DayWisePayColumns } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/type-orm-transactions';
import { DayWisePayEntity } from './day-wise-pay.entity';
import { DayWisePayRepository } from './day-wise-pay.repo';

@Injectable()
export class DayWisePayService {
    constructor(
        private dataSource: DataSource,
        private readonly dayWiseRepo: DayWisePayRepository,
    ) { }


    async saveDayWisePayExcel(formData: any): Promise<CommonResponseModel> {
        const transactionManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionManager.startTransaction();

            interface EmployeeRecord {
                employeeId: number;
                employee_code: string;
                job_id: number;
                rate: number;
            }

            // Standardizing column names
            const columnSet = new Set<string>();
            const updatedArray = formData.map(obj => {
                const reqObj = {};
                for (const key in obj) {
                    const newKey = key.replace(/\s/g, '').replace(/[\(\)\.]/g, '').replace(/-/g, '').replace(/MM/g, '').replace(/DD/g, '').replace(/YYYY/g, '');
                    if (newKey) {
                        columnSet.add(newKey);
                        reqObj[newKey] = obj[key] === "" ? null : obj[key]; // Convert empty strings to null
                    }
                }
                return reqObj;
            });

            // Validate columns
            const invalidColumns = [...columnSet].filter(col => !DayWisePayColumns.includes(col));
            if (invalidColumns.length > 0) {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 1110, "Excel columns don't match. Please attach the correct file.");
            }

            // Extract unique Employee-Job pairs
            const empJobPairs = updatedArray.map(data => ({ EmpId: data.EmpId, JobCode: data.JobCode }));
            const getEmpIdData: EmployeeRecord[] = await this.dayWiseRepo.getEmpIds({ empCode: empJobPairs });

            // Map Employee Data for fast lookup
            const empIdMap = new Map(getEmpIdData.map(emp => [emp.employee_code, emp]));

            // Fetch existing records in bulk
            const repository = transactionManager.getRepository(DayWisePayEntity);
            const existingRecords = await repository.find({
                where: updatedArray.map(data => ({
                    empCode: data.EmpId,
                    payDate: moment(data.Date, "YYYY-MM-DD").format("DD-MM-YYYY"),
                    jobCode: data.JobCode
                }))
            });

            // Create a Set for fast lookup
            const existingRecordsSet = new Set(
                existingRecords.map(record => `${record.empCode}-${record.payDate}-${record.jobCode}`)
            );

            // Prepare new records for bulk insert
            const newRecords = updatedArray.reduce((acc, data) => {
                const modifiedPayDate = moment(data.Date, "YYYY-MM-DD").format("DD-MM-YYYY");
                if (existingRecordsSet.has(`${data.EmpId}-${modifiedPayDate}-${data.JobCode}`)) {
                    return acc; // Skip existing records
                }

                const empRecord = empIdMap.get(data.EmpId);
                if (!empRecord) return acc; // Skip if no matching employee found

                acc.push({
                    empId: empRecord.employeeId,
                    empCode: data.EmpId,
                    jobId: empRecord.job_id,
                    jobCode: data.JobCode,
                    payDate: modifiedPayDate,
                    payMonth: moment(data.Date, "YYYY-MM-DD").format("YYYYMM"),
                    units: Number(data.Units) || 0, // Ensure numerical conversion
                    addEarn: Number(data.AdditionalEarning) || 0,
                    addDedu: Number(data.AdditionalDeduction) || 0,
                    jobRate: Number(empRecord.rate) || 0,
                    jobStatus: Number(empRecord.rate) == 0 ? 0 : 1,
                    empPay: (Number(data.Units) * Number(empRecord.rate) + Number(data.AdditionalEarning) + Number(data.AdditionalDeduction)).toFixed(2),
                });

                return acc;
            }, []);

            // Bulk Insert if there are new records
            if (newRecords.length > 0) {
                await repository.save(newRecords); // Use save() instead of insert()
            }

            await transactionManager.completeTransaction();
            return new CommonResponseModel(true, 1, "Data saved successfully");

        } catch (err) {
            console.error(err, "Error saving address info");
            await transactionManager.releaseTransaction();
            return new CommonResponseModel(false, 0, "An error occurred while processing the data");
        }
    }

    async getWorkerEmpBasic(req: any): Promise<CommonResponseModel> {
        try {
            const records = await this.dayWiseRepo.getWorkerEmpBasic(req);
            if (records.length > 0) {
                return new CommonResponseModel(true, 1, "Data fetched successfully", records);
            } else {
                return new CommonResponseModel(false, 0, "No data found for given criteria");
            }
        } catch (err) {
            console.error(err, "Error fetching worker basic pay");
            return new CommonResponseModel(false, 0, "An error occurred while fetching data");
        }
    }

    async getDayWiseData(req?: any): Promise<CommonResponseModel> {
        try {
            const records = await this.dayWiseRepo.getDayWiseRepo(req);
            if (records) {
                return new CommonResponseModel(true, 1, "Data fetched successfully", records);
            } else {
                return new CommonResponseModel(false, 0, "No data found");
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, "An error occurred while fetching day wise pay rec");
        }
    }
}
