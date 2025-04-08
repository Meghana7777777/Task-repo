import { Injectable } from "@nestjs/common";
import { BranchesMappingRepo } from "./repo/branches-mapping-repo";
import { BranchesMappingSharedDto, CommonResponseModel, DashboardReq } from "@hrexpert/shared-models";
import { BranchesMappingEntity } from "./entity/branches-mapping-entity";
import { BranchesMappingDto } from "./dto/branches-mapping-dto";

@Injectable()
export class BranchesMappingService {
    constructor (
        private branchesMappingRepo :BranchesMappingRepo,
    ) {}

    async createBranchMapping(req: BranchesMappingDto): Promise<CommonResponseModel> {
        console.log(req,'fffffffffffffffffffffffff')
        try {

            const entity = new BranchesMappingEntity();
            entity.branchId = req.branchId;
            entity.divisionId = req.divisionId;
            entity.departmentId = req.departmentId;
           
            const save = await this.branchesMappingRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Branch creation', []);
            }
        } catch (err) {
            throw err;
        }
    }

    async getBranchMapping(): Promise<CommonResponseModel> {
        try {
            const result = await this.branchesMappingRepo.getBranchMapping()
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

    async updateBranchMapping(req: BranchesMappingDto): Promise<CommonResponseModel> {
        try {
            const result = await this.branchesMappingRepo.update(
                { id: req.id },
                {
                    branchId: req.branchId,
                    departmentId: req.departmentId,
                    divisionId: req.divisionId,
                    updatedUser: req.updatedUser,
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

    async activateOrDeactivateBranchMapping(req: BranchesMappingDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.branchesMappingRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Branch found');
            }
    
            if (exists.isActive === req.isActive) {
                return new CommonResponseModel(false, 0, `Branch is already ${req.isActive ? 'activated' : 'deactivated'}`);
            }
    
            const update = await this.branchesMappingRepo.update(
                { id: req.id },
                { isActive: req.isActive }
            );
    
            if (update.affected) {
                return new CommonResponseModel(true, 1, `Branch ${req.isActive ? 'activated' : 'deactivated'} successfully`);
            } else {
                return new CommonResponseModel(false, 0, 'Failed to update the branch status');
            }
        } catch (err) {
            return err;
        }
    }

    async getDivisionByBranchId(req: DashboardReq): Promise<CommonResponseModel> {
        try{
            const getData = await this.branchesMappingRepo.getDivisionByBranchId(req.branchId)

            return getData.length > 0 
            ? new CommonResponseModel(true, 1, 'Data Retrieved', getData) 
            : new CommonResponseModel(false, 0, 'No Data Found')
        }catch(err){
            throw(err)
        }
    }

    async getDepartmentByBranchId(req: DashboardReq): Promise<CommonResponseModel> {
        try{
            const getData = await this.branchesMappingRepo.getDepartmentByBranchId(req.branchId)

            return getData.length > 0 
            ? new CommonResponseModel(true, 1, 'Data Retrieved', getData) 
            : new CommonResponseModel(false, 0, 'No Data Found')
        }catch(err){
            throw(err)
        }
    }
    

}