import { Injectable } from '@nestjs/common';

import { CommonResponseModel } from '@hrexpert/shared-models'
import { IdProofRepository } from './dto/id-proof-repo';
import { IdProofDto } from './dto/id-proof-dto';
import { IdProof } from './dto/id-proof-entity';


@Injectable()
export class IdProofService {

    constructor(
        private idProofRepo: IdProofRepository,
    ) { }

    async createIdProof(req: IdProofDto, isUpdate: boolean): Promise<CommonResponseModel> {
        try {
            // Check for duplicates (when creating or updating)
            const duplicateCheck = await this.idProofRepo.findOne({
                where: { name: req.name },
            });
    
            // If a duplicate is found and it's not the current record being updated
            if (duplicateCheck && (!isUpdate || duplicateCheck.id !== req.id)) {
                return new CommonResponseModel(false, 0, 'ID Proof with the same name already exists', []);
            }
    
            const entity = new IdProof();
            entity.name = req.name;
            entity.isActive = req.isActive;
            entity.versionFlag = req.versionFlag;
    
            if (isUpdate) {
                entity.id = req.id;
                entity.updatedUser = req.updatedUser;
            } else {
                entity.createdUser = req.createdUser;
            }
    
            const save = await this.idProofRepo.save(entity);
    
            if (save) {
                return new CommonResponseModel(true, 1, isUpdate ? 'Updated successfully' : 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in ID Proof operation', []);
            }
        } catch (err) {
            console.error('Error in createIdProof:', err);
            throw err;
        }
    }
    

    async getAllIdProofs(): Promise<CommonResponseModel> {
        const  result = await this.idProofRepo.getAllIdProofs()
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }

    async getActiveIdProofs(): Promise<CommonResponseModel> {
        const data = await this.idProofRepo.find({ where: {isActive: true }});
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active IDProof found', []);
    }


    async activateOrDeactivateIdProof(req: IdProofDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.idProofRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Id Proof found');
            }
            const update = await this.idProofRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Id Proof deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Id Proof already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Id Proof activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Id Proof already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }
}
