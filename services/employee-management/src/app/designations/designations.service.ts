import { CommonResponseModel, DesignationsReq, ErrorResponse } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { DesignationsEntity } from './entites/designations.entity';
import { DesignationsRepository } from './repositories/designations.repository';
import { DesignationIdDto } from './dto/designation.id.dto';


@Injectable()
export class DesignationsService {
    constructor(
        private designationsRepo: DesignationsRepository
    ) { }


    async createDesignations(req: DesignationsEntity): Promise<CommonResponseModel> {
        console.log(req)
        try {
            const existingRelation = await this.designationsRepo.findOne({ where: { name: req.name }, });

            if (existingRelation) {
                return new CommonResponseModel(false, 0, `Designation with name '${req.name}' already exists.`, []);
            }
            
            const entity = new DesignationsEntity();
            entity.name = req.name;
            entity.designationCode = req.designationCode;
            const save = await this.designationsRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Designations creation', []);
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, 'Failed', err)
        }
    }

    async getDesignations(): Promise<CommonResponseModel> {
        let result = await this.designationsRepo.getDesignations();
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async getActiveDesignations(): Promise<CommonResponseModel> {
        const data = await this.designationsRepo.find({
            where: {
                isActive: true
            }
        });

        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        } else {
            return new CommonResponseModel(true, 1, 'No active Designations found', []);
        }
    }

    async updateDesginations(req: DesignationsReq): Promise<CommonResponseModel> {
        try {
            // const existingRelation = await this.designationsRepo.findOne({ where: { name: req.name }, });

            // if (existingRelation) {
            //     return new CommonResponseModel(false, 0, `Designation with name '${req.name}' already exists.`, []);
            // }
            const result = await this.designationsRepo.update(
                { id: req.id },
                {
                    name: req.name,
                    designationCode: req.designationCode,
                    updatedUser: req.updatedUser,
                    isActive: req.isActive
                }
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

    async activateOrDeactivateDesignations(req: DesignationsReq): Promise<CommonResponseModel> {
        try {
            const exists = await this.designationsRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 77787, 'No Designations Found');
            }

            const update = await this.designationsRepo.update(
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

     async getDesignationName(dto:DesignationIdDto): Promise<any> {
            const record = await this.designationsRepo.findOne({ select: ['name'], where: { id: dto.designationId, isActive: true } });
            if (!record) {
              throw new ErrorResponse(99998, 'No Records Found');
            } else {
              return record
              
            }
          }
}
