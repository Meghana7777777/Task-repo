import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommonResponseModel } from "@hrexpert/backend-utils";
import { DocumentTypeDto } from "./dto/document-type.dto";
import { DocumentTypeEntity } from "./entity/document-type.entity";

@Injectable()
export class DocumentTypeService {
    constructor(
        @InjectRepository(DocumentTypeEntity)
        private readonly documentTypeRepository: Repository<DocumentTypeEntity>
    ) { }

    async createDocumentType(dto: DocumentTypeDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.documentTypeRepository.findOne({
                where: { documentType: dto.documentType }
            });
            if (exists) {
                return new CommonResponseModel(false, 3, 'Already exists');
            }
            const entity = new DocumentTypeEntity();
            entity.domain = dto.domain
            entity.documentType = dto.documentType;
            entity.isActive = true;
            const savedEntity = await this.documentTypeRepository.save(entity);
            return new CommonResponseModel(true, 1, 'Created Successfully', savedEntity);
        } catch (err) {
            console.error('Error in CreateDocumentType:', err);
            return new CommonResponseModel(false, 0, 'Internal server error');
        }
    }

    async getDocumentType(): Promise<CommonResponseModel> {
        const data = await this.documentTypeRepository.find({
            where: {
                isActive: true
            }
        });
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrivved Successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No Active Document Type found', []);
    }

    async deactivateDocumentType(documentTypeId: number): Promise<CommonResponseModel> {
        try {
            const documentType = await this.documentTypeRepository.findOne({ where: { documentTypeId } });

            if (!documentType) {
                return new CommonResponseModel(false, 0, 'document Type not found');
            }

            documentType.isActive = false;
            await this.documentTypeRepository.save(documentType);

            return new CommonResponseModel(true, 1, 'document Type deactivated successfully');
        } catch (error) {
            console.error('Error deactivating expense type:', error);
            return new CommonResponseModel(false, 0, 'Failed to deactivate domain type');
        }
    }

    async updateDomainType(documentTypeId: number, dto: DocumentTypeDto): Promise<CommonResponseModel> {
        try {
            const documentType = await this.documentTypeRepository.findOne({ where: { documentTypeId } });
            if (!documentType) {
                return new CommonResponseModel(false, 0, 'documentType Type not found');
            }
            documentType.documentType = dto.documentType ?? documentType.documentType;
            documentType.domain = dto.domain ?? documentType.domain;
            const updatedExpense = await this.documentTypeRepository.save(documentType);
            return new CommonResponseModel(true, 1, 'documentType updated successfully', updatedExpense);
        } catch (error) {
            console.error('Error updating document Type:', error);
            return new CommonResponseModel(false, 0, 'Failed to update document Type');
        }
    }

    async getDocumentTypesByDomain(domain: string): Promise<CommonResponseModel> {
        try {
            if (!domain) {
                return new CommonResponseModel(false, 0, 'Domain is required');
            }
            const documentTypes = await this.documentTypeRepository.find({
                where: { domain, isActive: true },
            });
            if (documentTypes.length > 0) {
                return new CommonResponseModel(true, 1, 'Document Types retrieved successfully', documentTypes);
            }
            return new CommonResponseModel(false, 0, `No document types found for domain: ${domain}`, []);
        } catch (error) {
            console.error('Error fetching document types by domain:', error);
            return new CommonResponseModel(false, 0, 'Failed to retrieve document types');
        }
    }

}
