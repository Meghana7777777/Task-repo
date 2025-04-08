import { CommonResponseModel, ErrorResponse } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { Division } from './division.entity';
import { DivisionDTO } from './dto/division.dto';
import { DivisionRepository } from './repositories/divison.repo';
import { DivisionIdDto } from './dto/division.id.dto';
@Injectable()
export class DivisionService {
    constructor(
        private divisionRepo: DivisionRepository,
    ) { }

    async createDivision(req: DivisionDTO): Promise<CommonResponseModel> {
        try {
            // Check for duplicates
            const duplicateCheck = await this.divisionRepo.findOne({
                where: [
                    { divisionName: req.divisionName },
                    { divisionCode: req.divisionCode },
                ],
            });
    
            if (duplicateCheck) {
                return new CommonResponseModel(
                    false,
                    0,
                    'Division with the same name or code already exists',
                    [],
                );
            }
    
            // Create a new Division entity
            const entity = new Division();
            entity.divisionName = req.divisionName;
            entity.divisionCode = req.divisionCode;
            entity.isActive = req.isActive;
            entity.createdUser = req.createdUser;
            entity.updatedUser = req.updatedUser;
            entity.versionFlag = req.versionFlag;
    
            // Save the new Division entity
            const save = await this.divisionRepo.save(entity);
    
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Division creation', []);
            }
        } catch (err) {
            console.error('Error in createDivision:', err);
            throw err;
        }
    }
    

    async getAllDivision(): Promise<CommonResponseModel> {
        const result = await this.divisionRepo.find()
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }

    async getActiveDivision(): Promise<CommonResponseModel> {
        const data = await this.divisionRepo.find({ where: { isActive: true } });
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active Division data found', []);
    }

    async updateDivision(req: DivisionDTO): Promise<CommonResponseModel> {
        try {
            // const duplicates =await this.divisionRepo.findOne({where:{divisionName:req.divisionName}})
            // if (duplicates) {
            //     return new CommonResponseModel(
            //         false,
            //         0,
            //         'Division with the same name already exists',
            //         [],
            //     );
            // }
            const result = await this.divisionRepo.update(
                { id: req.id },
                { divisionName: req.divisionName, divisionCode: req.divisionCode, updatedUser: req.updatedUser, isActive: req.isActive }
            );
            if (result.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully', result);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async activateOrDeactivateDivision(req: DivisionDTO): Promise<CommonResponseModel> {
        try {
            const exists = await this.divisionRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Division found');
            }
            const update = await this.divisionRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );
            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Division deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Division already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Division  activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Division  already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }

    async getAllActiveDivisions(): Promise<CommonResponseModel> {
        try {
            const data = await this.divisionRepo.getAllActiveDivisions()

            return data.length > 0
                ? new CommonResponseModel(true, 1, 'Data retrieved successfully', data)
                : new CommonResponseModel(true, 1, 'No data found', data)
        } catch (err) {
            throw (err)
        }
    }

      async getDivisionName(dto:DivisionIdDto): Promise<any> {
                const record = await this.divisionRepo.findOne({ select: ['divisionName'], where: { id: dto.divisionId, isActive: true } });
                if (!record) {
                  throw new ErrorResponse(99998, 'No Records Found');
                } else {
                  return record
                 
                }
              }
}
