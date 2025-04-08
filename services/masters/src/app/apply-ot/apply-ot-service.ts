import { CommonResponseModel } from "@hrexpert/shared-models";
import { ApplyOtRepository } from "./repo/apply-ot-repo"
import { ApplyOTEntity } from "./entity/apply-ot-entity";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ApplyOtDTO } from "./dto/apply-ot-dto";
import moment from "moment"

@Injectable()
export class ApplyOtService {
    constructor(
        private applyOtRepo: ApplyOtRepository,
        private dataSource: DataSource
    ) { }

    async createOt(req: any): Promise<CommonResponseModel> {
        try {
            const entity = new ApplyOTEntity();
            entity.employeeName = req.employeeName
            entity.date = moment(req.date).format("YYYY-MM-DD")
            entity.inTime = req.inTime
            entity.outTime = req.outTime
            entity.workingHours = req.workingHours

            const result = await this.applyOtRepo.save(entity)
            if (result) {
                return new CommonResponseModel(true, 6281481725, "Over Time Details Created", result)
            }
            else {
                return new CommonResponseModel(false, 8309649082, "Failed to create Over Time details")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getAllOt(): Promise<CommonResponseModel> {
        try {
            const result = await this.applyOtRepo.getAllOt()
            if (result) {
                return new CommonResponseModel(true, 6281481725, "Data Retrived", result)
            }
            else {
                return new CommonResponseModel(false, 8309649082, "No Data Found")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async updateOt(req: ApplyOtDTO): Promise<CommonResponseModel> {
        try {
            const update = await this.applyOtRepo.update({ id: req.id },
                {
                    employeeName: req.employeeName,
                    date: moment(req.date).format("YYYY-MM-DD"),
                    inTime: req.inTime,
                    outTime: req.outTime,
                    workingHours: req.workingHours,
                })
            if (update.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully', update);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async activateDeactivateOt(req: ApplyOtDTO): Promise<CommonResponseModel> {
        try {
            const exists = await this.applyOtRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No OT found');
            }
            const update = await this.applyOtRepo.update({ id: req.id }, { isActive: req.isActive })

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'OT Deactivated Successfully', update);
                }
                else {
                    return new CommonResponseModel(false, 0, 'Failed', []);
                }
            }
            else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'OT Activated Successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'OT Already Activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (error) {
            console.log(error);
        }
    }
}