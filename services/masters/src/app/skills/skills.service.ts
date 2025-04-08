import { CommonResponseModel, SkillsReq } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { SkillsEntity } from './entites/skills.entity';
import { SkillsRepository } from './repositories/skills.repository';


@Injectable()
export class SkillsService {
    constructor(
        private skillsRepo: SkillsRepository
    ) { }


    async createSkills(req: SkillsEntity): Promise<CommonResponseModel> {
        try {
            const existingRelation = await this.skillsRepo.findOne({ where: { name: req.name }, });

            if (existingRelation) {
                return new CommonResponseModel(false, 0, `Skills with name '${req.name}' already exists.`, []);
            }
            
            const entity = new SkillsEntity();
            entity.name = req.name;
            const save = await this.skillsRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Branch creation', []);
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, 'Failed', err)
        }
    }

    async getSkills(): Promise<CommonResponseModel> {
        const result = await this.skillsRepo.getSkills()
        console.log(result, "55555")
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async getActiveSkills(): Promise<CommonResponseModel> {
        const data = await this.skillsRepo.find({
            where: {
                isActive: true
            }
        });

        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        } else {
            return new CommonResponseModel(true, 1, 'No active branches found', []);
        }
    }

    async updateSkills(req: SkillsReq): Promise<CommonResponseModel> {
        try {
            const result = await this.skillsRepo.update(
                { id: req.id },
                {
                    name: req.name,
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

    async activateOrDeactivateSkills(req: SkillsReq): Promise<CommonResponseModel> {
        try {
            const exists = await this.skillsRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Branch found');
            }

            const update = await this.skillsRepo.update(
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
}
