import { CommonResponseModel } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { RelationDTO } from './dto/relations-dto';
import { RelationsRepository } from './dto/relations.repo';
import { Relations } from './relations.entity';

@Injectable()
export class RelationsService {
    constructor(
        private relationsRepo: RelationsRepository,
    ) { }


    async createRelations(req: RelationDTO): Promise<CommonResponseModel> {
        console.log(req);
        try {
            const existingRelation = await this.relationsRepo.findOne({
                where: { relation: req.relation },
            });
            if (existingRelation) { return new CommonResponseModel(false, 0, `Relation with name '${req.relation}' already exists.`, []); }
            const entity = new Relations();
            entity.relation = req.relation;
            entity.isActive = req.isActive;
            entity.createdUser = req.createdUser;
            entity.updatedUser = req.updatedUser;
            entity.versionFlag = req.versionFlag;
            const save = await this.relationsRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Relations creation', []);
            }
        } catch (err) {
            console.error(err);
            return new CommonResponseModel(false, 0, 'An error occurred during creation', []);
        }
    }


    async getAllRelations(): Promise<CommonResponseModel> {
        const result = await this.relationsRepo.getAllRelations()
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }

    async getActiveRelations(): Promise<CommonResponseModel> {
        const data = await this.relationsRepo.find({ where: { isActive: true } });
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active relations data found', []);
    }

    async updateRelations(req: RelationDTO): Promise<CommonResponseModel> {
        try {
            const result = await this.relationsRepo.update(
                { id: req.id },
                { relation: req.relation, updatedUser: req.updatedUser, isActive: req.isActive }
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

    async activateOrDeactivateRelations(req: RelationDTO): Promise<CommonResponseModel> {
        try {
            const exists = await this.relationsRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Relations found');
            }
            const update = await this.relationsRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );
            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Relations deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Relations already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Relations  activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Relations  already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }
}
