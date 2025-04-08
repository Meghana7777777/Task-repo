import { CommonResponseModel } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { EmployeeTypeDto } from './dto/employee-type-dto';
import { EmployeeType } from './dto/employee-type-entity';
import { EmployeeTypeRepository } from './dto/employee-type-repository';


@Injectable()
export class EmployeeTypeService {

    constructor(
        private empTypeRepo: EmployeeTypeRepository,
    ) { }

    async createEmployeeType(req: EmployeeTypeDto, isUpdate: boolean): Promise<CommonResponseModel> {
        // console.log(req)
        try {
            const findDuplicate = await this.empTypeRepo.find({ where: { name: req.name } })
            if (findDuplicate.length > 0) {
                return new CommonResponseModel(false, 0, 'Employee Type Already Exists')
            }
            const entity = new EmployeeType();
            entity.name = req.name;
            entity.isActive = req.isActive;
            entity.versionFlag = req.versionFlag;
            if (isUpdate) {
                entity.id = req.id
                entity.updatedUser = req.updatedUser;
            } else {
                entity.createdUser = req.createdUser;
            }
            const save = await this.empTypeRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Employee Type Proof creation', []);
            }
        } catch (err) {
            throw err;
        }
    }

    async getAllEmployeeTypes(): Promise<CommonResponseModel> {
        const result = await this.empTypeRepo.getAllEmployeeTypes()
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }

    async getActiveEmployeeType(): Promise<CommonResponseModel> {
        const data = await this.empTypeRepo.find({ where: { isActive: true } });
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active IDProof found', []);
    }


    async activateOrDeactivateEmployeetype(req: EmployeeTypeDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.empTypeRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Employee Type found');
            }
            const update = await this.empTypeRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Employee Type deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Employee Type already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Employee Type activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Employee Type already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }
}
