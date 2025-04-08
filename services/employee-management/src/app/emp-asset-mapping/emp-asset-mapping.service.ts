import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmpAssetMappingEntity } from "./entity/emp-asset-mapping.entity";
import { Repository } from "typeorm";
import { EmpAsssetMappingDto } from "./dto/emp-asset-mapping.dto";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";

@Injectable()
export class EmpAssetMappingService {
    constructor(
        @InjectRepository(EmpAssetMappingEntity)
        private readonly empAssetMappingRepository: Repository<EmpAssetMappingEntity>,
    ) { }

    async createEmpAssetMapping(empAsssetMappingDto: EmpAsssetMappingDto): Promise<CommonResponse> {
        const { assetId, ...commonData } = empAsssetMappingDto;
        console.log('yyyyyyyyyyyyyy', empAsssetMappingDto)
        if (!assetId || assetId.length === 0) {
            return new CommonResponse(false, 0, 'Asset list cannot be empty', []);
        }
        const savedDocuments: EmpAssetMappingEntity[] = [];
        for (const singleAsset of assetId) {
            const empAssetMappingEntity = this.empAssetMappingRepository.create({
                ...commonData,
                assetId: singleAsset,
            });
            const savedDocument = await this.empAssetMappingRepository.save(empAssetMappingEntity);
            savedDocuments.push(savedDocument);
        }
        return new CommonResponse(true, savedDocuments.length, 'Documents created successfully', savedDocuments);
    }

    async removeEmpAssetMapping(employeeId: number): Promise<CommonResponse> {
        const result = await this.empAssetMappingRepository.delete({ employeeId });
        if (result.affected && result.affected > 0) {
            return new CommonResponse(true, result.affected, 'Records deleted successfully');
        } else {
            return new CommonResponse(false, 0, 'No records found for given employeeId');
        }
    }


    async updateEmpAssetMapping(empAsssetMappingDto: EmpAsssetMappingDto): Promise<CommonResponse> {
        const { assetId, ...commonData } = empAsssetMappingDto;
        console.log('updateEmpAssetMapping', empAsssetMappingDto)
        if (!empAsssetMappingDto.employeeId) {
            return new CommonResponse(false, 0, 'Employee ID is required', []);
        }
        if (!assetId || assetId.length === 0) {
            return new CommonResponse(false, 0, 'Asset list cannot be empty', []);
        }
        const existingRecords = await this.empAssetMappingRepository.find({ where: { employeeId: empAsssetMappingDto.employeeId } });
        if (existingRecords.length > 0) {
            await this.empAssetMappingRepository.delete({ employeeId: empAsssetMappingDto.employeeId });
        }
        const savedDocuments: EmpAssetMappingEntity[] = [];
        for (const singleAsset of assetId) {
            const empAssetMappingEntity = this.empAssetMappingRepository.create({
                ...commonData,
                employeeId: empAsssetMappingDto.employeeId,
                assetId: singleAsset,
            });
            const savedDocument = await this.empAssetMappingRepository.save(empAssetMappingEntity);
            savedDocuments.push(savedDocument);
        }
        return new CommonResponse(true, savedDocuments.length, 'Records updated successfully', savedDocuments);
    }


    async getEmpAssetMappings(): Promise<CommonResponse> {
        const records = await this.empAssetMappingRepository.find();
        if (records.length === 0) {
            return new CommonResponse(false, 0, 'No records found', []);
        }
        const groupedRecords = records.reduce((acc, record) => {
            const { employeeId, assetId, ...otherData } = record;
            const existingEntry = acc.find((entry) => entry.employeeId === employeeId);

            if (existingEntry) {
                existingEntry.assetIds.push(assetId);
            } else {
                acc.push({
                    employeeId,
                    assetIds: [assetId],
                    ...otherData,
                });
            }
            return acc;
        }, []);
        return new CommonResponse(true, groupedRecords.length, 'Employee asset mappings retrieved', groupedRecords);
    }
}