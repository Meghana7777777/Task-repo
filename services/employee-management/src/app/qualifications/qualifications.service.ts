import { CommonResponseModel } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { QualificationsDto } from './dto/qualifications.dto';
import { QualificationsEntity } from './entites/qualifications.entity';
import { QualificationsRepository } from './repositories/qualifications.repository';
import { SpecializationsEntity } from './entites/specializations.entity';
import { SpecializationDto } from './dto/specialization.dto';
import { SpecializationRepository } from './repositories/specialization.repository';


@Injectable()
export class QualificationsService {
    constructor(
        private qualificationsRepo: QualificationsRepository,
        private specializationRepo: SpecializationRepository
    ) { }


    async createQualifications(req: QualificationsEntity): Promise<CommonResponseModel> {
        try {
            const existingRelation = await this.qualificationsRepo.findOne({ where: { name: req.name }, });
            if (existingRelation) {
                return new CommonResponseModel(false, 0, `Qualification with name '${req.name}' already exists.`, []);
            }
            const entity = new QualificationsEntity();
            entity.name = req.name;
            const save = await this.qualificationsRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Branch creation', []);
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, 'Failed', err)
        }
    }

    async getQualifications(): Promise<CommonResponseModel> {
        const result = await this.qualificationsRepo.getQualifications()
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async getActiveQualifications(): Promise<CommonResponseModel> {
        const data = await this.qualificationsRepo.find({ where: { isActive: true } });
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        } else {
            return new CommonResponseModel(true, 1, 'No active branches found', []);
        }
    }

    async updateQualifications(req: QualificationsDto): Promise<CommonResponseModel> {
        try {
            const result = await this.qualificationsRepo.update(
                { id: req.id },
                { name: req.name, updatedUser: req.updatedUser, isActive: req.isActive });
            if (result.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully', result);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async activateOrDeactivateQualifications(req: QualificationsDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.qualificationsRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Branch found');
            }
            const update = await this.qualificationsRepo.update(
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

    async createSpecializations(req: SpecializationsEntity): Promise<CommonResponseModel> {
        try {
            const existingRelation = await this.specializationRepo.findOne({ where: { specialization: req.specialization, qualificationId: req.qualificationId }, });
            if (existingRelation) {
                return new CommonResponseModel(false, 0, `Specialization already exists for Qualification already exists.`, []);
            }
            const entity = new SpecializationsEntity();
            entity.specialization = req.specialization;
            entity.qualificationId = req.qualificationId;
            const save = await this.specializationRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in creation', []);
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, 'Failed', err)
        }
    }

    async getSpecializations(req?: any): Promise<CommonResponseModel> {
        const result = await this.specializationRepo.getSpecializations(req)
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async getActiveSpecializations(): Promise<CommonResponseModel> {
        const data = await this.specializationRepo.find({ where: { isActive: true } });
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        } else {
            return new CommonResponseModel(true, 1, 'No active Specializations found', []);
        }
    }

    async updateSpecializations(req: SpecializationDto): Promise<CommonResponseModel> {
        try {
            const existingRelation = await this.specializationRepo.findOne({ where: { specialization: req.specialization, qualificationId: req.qualificationId }, });
            if (existingRelation) {
                return new CommonResponseModel(false, 0, `Specialization already exists for Qualification already exists.`, []);
            }
            const result = await this.specializationRepo.update(
                { id: req.id },
                { specialization: req.specialization, qualificationId: req.qualificationId, updatedUser: req.updatedUser, isActive: req.isActive });
            if (result.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully', result);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async activateOrDeactivateSpecializations(req: SpecializationDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.specializationRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Branch found');
            }
            const update = await this.specializationRepo.update(
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
