import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommonResponseModel } from "@hrexpert/backend-utils";
import { DomainEntity } from "./entity/domain.entity";
import { DomainDto } from "./dto/domain.dto";

@Injectable()
export class DomainService {
    constructor(
        @InjectRepository(DomainEntity)
        private readonly domainTypeRepository: Repository<DomainEntity>
    ) { }

    async CreateDomainType(dto: DomainDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.domainTypeRepository.findOne({
                where: { domainType: dto.domainType }
            });
            if (exists) {
                return new CommonResponseModel(false, 3, 'Already exists');
            }
            const entity = new DomainEntity();
            entity.domainType = dto.domainType;
            entity.isActive = true;
            const savedEntity = await this.domainTypeRepository.save(entity);
            return new CommonResponseModel(true, 1, 'Created Successfully', savedEntity);
        } catch (err) {
            console.error('Error in CreateDomainType:', err);
            return new CommonResponseModel(false, 0, 'Internal server error');
        }
    }

    async getDomianType(): Promise<CommonResponseModel> {
        const data = await this.domainTypeRepository.find({
            where: {
                isActive: true
            }
        });
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrivved Successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No Active Domain Type found', []);
    }

    async deactivateDomainType(domainId: number): Promise<CommonResponseModel> {
        try {
            const domainType = await this.domainTypeRepository.findOne({ where: { domainId } });

            if (!domainType) {
                return new CommonResponseModel(false, 0, 'Domain Type not found');
            }

            domainType.isActive = false;
            await this.domainTypeRepository.save(domainType);

            return new CommonResponseModel(true, 1, 'Domain Type deactivated successfully');
        } catch (error) {
            console.error('Error deactivating expense type:', error);
            return new CommonResponseModel(false, 0, 'Failed to deactivate domain type');
        }
    }

    async updateDomainType(domainId: number, dto: DomainDto): Promise<CommonResponseModel> {
        try {
            const domainType = await this.domainTypeRepository.findOne({ where: { domainId } });
            if (!domainType) {
                return new CommonResponseModel(false, 0, 'Expense Type not found');
            }
            domainType.domainType = dto.domainType ?? domainType.domainType;
            // domainType.isActive = dto.isActive ?? expenseType.isActive;
            const updatedExpense = await this.domainTypeRepository.save(domainType);
            return new CommonResponseModel(true, 1, 'Expense Type updated successfully', updatedExpense);
        } catch (error) {
            console.error('Error updating domain type:', error);
            return new CommonResponseModel(false, 0, 'Failed to update domain type');
        }
    }

}
