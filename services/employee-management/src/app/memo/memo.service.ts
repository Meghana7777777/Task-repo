// src/services/master.service.ts
import { CommonResponseModel } from '@hrexpert/backend-utils';
import { MemoReq } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemoEntity } from './memo.entity';
import { MemoRepository } from './memo.repo';
import dayjs from 'dayjs';

@Injectable()
export class MemoService {
    constructor(
        private readonly memoRepo: MemoRepository,
    ) { }


    async createMemo(req: MemoReq): Promise<CommonResponseModel> {
        console.log(req)
        try {
            const entity = new MemoEntity();
            entity.date = dayjs(req.date).format('YYYY-MM-DD');
            entity.type = req.type;
            entity.feedBackOn = req.feedBackOn;
            entity.description = req.description;
            entity.impactOnBussiness = req.impactOnBussiness;
            entity.employeeId = req.employeeId;
            entity.isActive = req.isActive;
            entity.createdUser = req.createdUser;
            entity.updatedUser = req.updatedUser;
            entity.versionFlag = req.versionFlag;
            const save = await this.memoRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);

            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in creation', []);

            }
        } catch (err) {
            throw err;
        }
    }

    async getAllMemo(): Promise<CommonResponseModel> {
        const result = await this.memoRepo.getAllMemoRepo()
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }

    async getActiveMemo(): Promise<CommonResponseModel> {
        const data = await this.memoRepo.find({
            where: {
                isActive: true
            }
        });

        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active memos found', []);
    }

    async updateMemo(req: MemoReq): Promise<CommonResponseModel> {
        try {
            const result = await this.memoRepo.update(
                { id: req.id },
                {
                    // date: req.date,
                    // type: req.type,
                    // feedBackOn: req.feedBackOn,
                    // impactOnBussiness: req.impactOnBussiness,
                    // description : req.description,
                    // updatedUser: req.updatedUser,
                    // isActive: req.isActive
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

    async activateOrDeactivateMemo(req: MemoReq): Promise<CommonResponseModel> {
        try {
            const exists = await this.memoRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Date found');
            }

            const update = await this.memoRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }

}
