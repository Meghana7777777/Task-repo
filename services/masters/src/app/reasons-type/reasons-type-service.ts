import { CommonResponseModel, ReasonsTypeDto } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { ReasonsTypeEntity } from './reasons-type-entity';
import { ReasonsTypeRepository } from './dto/reasons-type-repository';


@Injectable()
export class ReasonsTypeService {

    constructor(
        private reasonsTypeRepo: ReasonsTypeRepository,
    ) { }

    // async createReasonsType(req: ReasonsTypeDto, isUpdate: boolean): Promise<CommonResponseModel> {
    //     try {
    //         const findDuplicate = await this.reasonsTypeRepo.find({ where: { id: req.id } })
    //         if (findDuplicate.length > 0) {
    //             return new CommonResponseModel(false, 0, 'Reasons Type Already Exists')
    //         }
    //         const entity = new ReasonsTypeEntity();
    //         console.log(entity,'qqqqqqqqqqqqqqqqqqqs')
    //         entity.id = req.id;
    //         entity.name = req.name;
    //         entity.isActive = req.isActive;
    //         entity.versionFlag = req.versionFlag;
    //         if (isUpdate) {
    //             console.log(isUpdate,'+++++++++++++++')
    //             entity.id = req.id;
    //             entity.updatedUser = req.updatedUser;
    //         } else {
    //             entity.createdUser = req.createdUser;
    //         }
    //         const save = await this.reasonsTypeRepo.save(entity);
    //         if (save) {
    //             return new CommonResponseModel(true, 1, 'Created successfully', save);
    //         } else {
    //             return new CommonResponseModel(false, 0, 'Something went wrong in Reasons Type Proof creation', []);
    //         }
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    async createReasonsType(req: ReasonsTypeDto, isUpdate: boolean): Promise<CommonResponseModel> {
        try {
            // If not an update, check for duplicates
            if (!isUpdate) {
                const findDuplicate = await this.reasonsTypeRepo.find({ where: { id: req.id } });
                if (findDuplicate.length > 0) {
                    return new CommonResponseModel(false, 0, 'Reasons Type Already Exists');
                }
            }
    
            const entity = new ReasonsTypeEntity();
            console.log(entity, 'qqqqqqqqqqqqqqqqqqqs');
            entity.id = req.id;
            entity.name = req.name;
            entity.isActive = req.isActive;
            entity.versionFlag = req.versionFlag;
    
            if (isUpdate) {
                console.log(isUpdate, '+++++++++++++++');
                // Only set updatedUser for updates
                entity.updatedUser = req.updatedUser;
            } else {
                // Set createdUser for new entries
                entity.createdUser = req.createdUser;
            }
    
            const save = await this.reasonsTypeRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Reasons Type Proof creation', []);
            }
        } catch (err) {
            throw err;
        }
    }
    

        async getAllReasonsTypes(): Promise<CommonResponseModel> {
            const result = await this.reasonsTypeRepo.getAllReasonsTypes()
            if (result.length > 0) {
                return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
            }
            return new CommonResponseModel(true, 1, 'No data found', []);
        }

    async getActiveReasonsType(): Promise<CommonResponseModel> {
        const data = await this.reasonsTypeRepo.find({ where: { isActive: true } });
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active IDProof found', []);
    }


    async activateOrDeactivateReasonsType(req: ReasonsTypeDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.reasonsTypeRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Reasons Type found');
            }
            const update = await this.reasonsTypeRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Reasons Type deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Reasons Type already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Reasons Type activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Reasons Type already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }
}
