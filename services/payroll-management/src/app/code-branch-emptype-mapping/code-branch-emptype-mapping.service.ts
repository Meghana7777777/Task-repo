import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EmployeeOnboardingService, PayrollRecordsSharedService } from "@hrexpert/shared-services";
import { Injectable } from "@nestjs/common";
import { PayrollCodeBranchMappingDto } from "./dto/code-branch-emptype-mapping.dto";
import { PayrollCodeBranchMappingEntity } from "./entities/code-branch-emptype-mapping.entity";
import { PayrollCodeBranchMappingReposirtory } from "./repo/code-branch-emptype-mapping-repo";

@Injectable()
export class PayrollCodeBranchMappingService {
    constructor(
        private readonly repo: PayrollCodeBranchMappingReposirtory,
        private readonly empService: EmployeeOnboardingService,
        private readonly payrollRecService: PayrollRecordsSharedService,
    ) { }

    async createPayrollCodeBranchMapping(req: PayrollCodeBranchMappingDto): Promise<CommonResponseModel> {
        try {
            const existingBranchWithMappedCode = await this.repo.findOne({
                where: { branchId: req.branchId }
            });  
            if (existingBranchWithMappedCode) {
                return new CommonResponseModel(false, 0, 'Branch is already Mapped',[]);
            } else {
                const entity = new PayrollCodeBranchMappingEntity();
                entity.payrollCode = req.payrollCode;
                entity.branchId = req.branchId;
                entity.employeeTypeId = req.employeeTypeId;
                const save = await this.repo.save(entity);
                if (save) {
                    await this.payrollRecService.generateEmpPayrollRecordsForBranch({ branchId: req.branchId })
                    return new CommonResponseModel(true, 1, 'Created successfully', save);
                } else {
                    return new CommonResponseModel(false, 0, 'Something went wrong in creation', []);
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async updatePayrollCodeBranchMapping(req: PayrollCodeBranchMappingDto): Promise<CommonResponseModel> {
        try {
            const result = await this.repo.update(
                { id: req.id },
                {
                    payrollCode: req.payrollCode,
                    branchId: req.branchId,
                    employeeTypeId: req.employeeTypeId,
                    updatedUser: req.updatedUser,
                    isActive: req.isActive
                }
            );
            if (result.affected > 0) {
                await this.payrollRecService.generateEmpPayrollRecordsForBranch({ branchId: req.branchId })
                return new CommonResponseModel(true, 1, 'Updated successfully', result);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async activateOrDeactivatePayrollCodeBranchMapping(req: PayrollCodeBranchMappingDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.repo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No found');
            }

            const update = await this.repo.update(
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

    async getPayrollCodeBranchMapping(): Promise<CommonResponseModel> {
        const result = await this.repo.jjjjjjjjjjjRepo()
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async getActivePayrollCodeBranchMapping(): Promise<CommonResponseModel> {
        const data = await this.repo.find({
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
}