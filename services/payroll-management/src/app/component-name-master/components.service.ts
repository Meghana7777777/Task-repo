import { CommonResponseModel } from "@hrexpert/backend-utils";
import { Injectable } from "@nestjs/common";
import { ComponentNamesDto } from "./dto/component-name.dto";
import { ComponentNamesEntity } from "./entities/components-names.entity";
import { ComponentNamesRepository } from "./repo/component-names-repo";

@Injectable()
export class ComponentNamesService {
    constructor(
        private readonly componentNamesRepo: ComponentNamesRepository,
    ) { }

    async createComponentNames(req: ComponentNamesDto): Promise<CommonResponseModel> {
        try {
            let derivedRuleData
            const convertToBooleanOrNull = (value) => {
                return value === undefined || value === null || value === "" ? null : Boolean(Number(value));
            }
            derivedRuleData = req.isDerived === "1" ? 1 : 0;
            const entity = new ComponentNamesEntity();
            entity.componentName = req.componentName;
            entity.componentNameCode = req.componentNameCode;
            entity.type = req.type;
            entity.roundStrg = req.roundStrg;
            entity.componentType = req.componentType;
            entity.isDerived = convertToBooleanOrNull(req.isDerived);
            // entity.derivedRule = convertToBooleanOrNull(derivedRuleData);
            entity.cutOffAmount = convertToBooleanOrNull(req.cutOffAmount);
            entity.calculatedRule = convertToBooleanOrNull(req.calculatedRule);
            const save = await this.componentNamesRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Component Name creation', []);
            }
        } catch (err) {
            throw err;
        }
    }

    async updateComponentNames(req: ComponentNamesDto): Promise<CommonResponseModel> {
        const convertToBooleanOrNull = (value) => {
            return value === undefined || value === null || value === "" ? null : Boolean(Number(value));
        };
        try {
            // derivedRuleData = req.isDerived === "1"||'Yes' ? 1 : 0;
            const result = await this.componentNamesRepo.update(
                { id: req.id },
                {
                    componentName: req.componentName,
                    componentNameCode: req.componentNameCode,
                    type: req.type,
                    roundStrg: req.roundStrg,
                    componentType : req.componentType,
                    isDerived: convertToBooleanOrNull(req.isDerived),
                    // derivedRule:  convertToBooleanOrNull(req.isDerived),
                    cutOffAmount: convertToBooleanOrNull(req.cutOffAmount),
                    calculatedRule: convertToBooleanOrNull(req.calculatedRule),
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

    async activateOrDeactivateComponentsNames(req: ComponentNamesDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.componentNamesRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Branch found');
            }

            const update = await this.componentNamesRepo.update(
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

    async getComponentsNames(): Promise<CommonResponseModel> {
        const result = await this.componentNamesRepo.getComponentsNamesRepo()
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async getActiveComponentsNames(): Promise<CommonResponseModel> {
        const data = await this.componentNamesRepo.find({
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