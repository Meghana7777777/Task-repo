import { CommonResponseModel } from '@hrexpert/backend-utils';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EmployeeLogsDTO } from './dto/employee-logs.dto';
import { EmployeeLogsEntity } from './entities/employee-logs.entity';
import { EmployeeLogsRepository } from './repositorys/employee-logs-repo';
import { DashboardReq, EmpDataReq } from '@hrexpert/shared-models';

@Injectable()
export class EmployeeLogsService {
    constructor(
        private dataSource: DataSource,
        private employeeLogsRepo: EmployeeLogsRepository
    ) { }

    async createEmployeeLogs(dto: EmployeeLogsDTO): Promise<CommonResponseModel> {
        try {
            const entity = new EmployeeLogsEntity();
            entity.employeeId = dto.employeeId
            entity.actionType = dto.actionType
            entity.role = dto.role
            entity.previousValues = dto.previousValues
            entity.updatedValues = dto.updatedValues
            entity.remarks = dto.remarks
            entity.updatedUser = dto.updatedUser
            const result = await this.employeeLogsRepo.save(entity)
            if (result) {
                return new CommonResponseModel(true, 1, 'Logs Created ', result)
            } else {
                return new CommonResponseModel(false, 0, 'Failed Logs ')
            }
        } catch (err) {
            console.log(err);
        }
    }

    // async getAllEmployeeLogs(req?:EmpDataReq): Promise<CommonResponseModel> {
    //     try {
    //         const result = await this.employeeLogsRepo.getAllEmployeeLogs(req)
    //         console.log(result,"111111111111111111111result")
    //         if (result) {
    //             return new CommonResponseModel(true, 1, 'Data Retrived ', result)
    //         } else {
    //             return new CommonResponseModel(false, 0, 'Failed Retrived ')
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    async  getAllEmployeeLogs(req?:EmpDataReq): Promise<CommonResponseModel> {
        try {
            const branchData = await this.employeeLogsRepo.getAllEmployeeLogs(req);
            if (branchData.length > 0) {
                for (const branch of branchData) {
                    const empTypeReq = { ...req, employeeId: branch.employeeId };
                    
                    const empTypeData = await this.employeeLogsRepo.getAllEmployeeChildLogs(empTypeReq);
               
                    branch.empTypeData = empTypeData;
                   
                }
               
                return new CommonResponseModel(true, 1, 'Data retrieved', branchData);
                
            } else {
                return new CommonResponseModel(false, 0, 'No data', []);
            }
        } catch (err) {
            throw err;
        }
    }

}