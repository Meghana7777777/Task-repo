import { CommonResponseModel, ErrorResponse } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { DepartmentsEntity } from './entites/departments-entity';
import { DepartmentsRepository } from './repositories/departments-repo';
import { DepartmentIdDto } from './dto/department-id.dto';

@Injectable()
export class DepartmentsService {
    constructor(
        private departmentRepo: DepartmentsRepository
    ) { }

    async createDepartments(req: any): Promise<CommonResponseModel> {
        try {
            const existingRelation = await this.departmentRepo.findOne({
                where: { name: req.name },
            });
    
            if (existingRelation) {
                return new CommonResponseModel(
                    false,
                    0,
                    `Department with name '${req.name}' already exists.`,
                    []
                );
            }
    
            // Iterate over the array of HOD IDs and create multiple department entries
            const savedDepartments = [];
            for (const hodId of req.hod) {
                const entity = new DepartmentsEntity();
                entity.empId = req.empId; // Assuming empId is the same for all
                entity.name = req.name;
                entity.code = req.code;
                entity.hod = hodId; // Assign the current HOD ID
    
                const result = await this.departmentRepo.save(entity);
                savedDepartments.push(result);
            }
    
            if (savedDepartments.length > 0) {
                return new CommonResponseModel(
                    true,
                    1,
                    "Departments created successfully for all selected HODs.",
                    savedDepartments
                );
            } else {
                return new CommonResponseModel(false, 0, "Failed to create departments.", []);
            }
        } catch (err) {
            console.error("Error in createDepartments:", err);
            throw err;
        }
    }

    async getAllDepartments(): Promise<CommonResponseModel> {
        try {
            const result = await this.departmentRepo.getAllDepartments()
            if (result) {
                return new CommonResponseModel(true, 6281481725, "Data Retrieved", result)
            }
            else {
                return new CommonResponseModel(false, 8309649082, "No Data Found")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async updateDepartment(req: any): Promise<CommonResponseModel> {
        try {
            const update = await this.departmentRepo.update({ id: req.id }, { name: req.name, code: req.code, hod: req.hod, empId: req.empId })
            if (update.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully', update);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async activateDeactivateDepartment(req: any): Promise<CommonResponseModel> {
        try {
            const exists = await this.departmentRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Department found');
            }
            const update = await this.departmentRepo.update({ id: req.id }, { isActive: req.isActive, updatedUser: req.updatedUser })

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Department Deactivated Successfully', update);
                }
                else {
                    return new CommonResponseModel(false, 0, 'Failed', []);
                }
            }
            else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Department Activated Successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Department Already Activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getAllActiveDepartments(): Promise<CommonResponseModel> {
        try {
            const result = await this.departmentRepo.find({ where: { isActive: true } })
            if (result) {
                return new CommonResponseModel(true, 6281481725, "Data Retrieved", result)
            }
            else {
                return new CommonResponseModel(false, 8309649082, "No Data Found")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getActiveDepartments(): Promise<CommonResponseModel> {
        try {
            const data = await this.departmentRepo.getActiveDepartments()
            return data.length > 0
                ? new CommonResponseModel(true, 1, 'Data retrieved successfully', data)
                : new CommonResponseModel(false, 0, 'No data found', [])
        } catch (err) {
            throw (err)
        }
    }

    async getdeparmentName(dto: DepartmentIdDto): Promise<any> {
        const record = await this.departmentRepo.findOne({ select: ['name'], where: { id: dto.departmentId, isActive: true } });
        if (!record) {
          throw new ErrorResponse(99998, 'No Records Found');
        } else {
          return record
         
        }
      }

}
