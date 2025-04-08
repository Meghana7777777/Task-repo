import { CommonResponseModel, ReferenceFeatures } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { DataSource, Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-model-doc.dto';
import { UpdateDocumentDto } from './dto/update-model.doc';
import { DocumentEntity } from './entities/document.entity';
import { FileUploadEntity } from './entities/file-upload.entity';
import { FileUploadRepo } from './repos/file-upload-repo';
import { join } from 'path';
import * as fs from 'fs';
import { create } from 'domain';
@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(DocumentEntity)
        private readonly documentRepository: Repository<DocumentEntity>,
        private fileUploadRepo: FileUploadRepo,
        private datasource: DataSource,
    ) { }

    // Create a new document
    async createDocument(createDocumentDto: CreateDocumentDto): Promise<CommonResponse> {
        const { branch, ...commonData } = createDocumentDto;
        console.log('yyyyyyyyyyyyyy', createDocumentDto)
        if (!branch || branch.length === 0) {
            return new CommonResponse(false, 0, 'Branch list cannot be empty', []);
        }

        const savedDocuments: DocumentEntity[] = [];

        for (const singleBranch of branch) {
            const documentEntity = this.documentRepository.create({
                ...commonData,
                branch: singleBranch,
            });

            const savedDocument = await this.documentRepository.save(documentEntity);
            savedDocuments.push(savedDocument);
        }

        return new CommonResponse(true, savedDocuments.length, 'Documents created successfully', savedDocuments);
    }

    // Update an existing document
    async updateDocument(documentId: number, updateDocumentDto: UpdateDocumentDto): Promise<DocumentEntity> {
        console.log('Updating document with ID:', documentId);
        console.log('Update DTO:', updateDocumentDto);
        const document = await this.documentRepository.findOne({ where: { document_id: documentId } });
        if (!document) {
            throw new Error('Document not found');
        }
        Object.assign(document, updateDocumentDto);
        return this.documentRepository.save(document);
    }


    // Find all documents
    async findAllDocuments(): Promise<any[]> {
        const data: any[] = await this.documentRepository.find();

        for (const rec of data) {
            const files = await this.datasource.getRepository(FileUploadEntity).find({ where: { featuresRefNo: rec.file_id_unq, featuresRefName: ReferenceFeatures.KR } })
            for (const file of files) {
                if (!rec.filesData) {
                    rec.filesData = []
                }
                rec.filesData.push({
                    fileName: file?.fileName,
                    fileid: file?.fileUploadId,
                    filePath: file?.filePath,
                    featuresReferenceNo: file?.featuresRefNo,
                })
            }
        }
        return data;
    }

    // Find a document by ID
    async findOneDocumentByid(file_id_unq: number): Promise<DocumentEntity> {
        return this.documentRepository.findOne({ where: { document_id: file_id_unq } });
    }

    // Delete a document
    async removeDocument(documentId: number): Promise<void> {
        await this.documentRepository.delete(documentId);
    }


    async updateFileUpload(filesData: any, id: any): Promise<CommonResponseModel> {
        try {
            console.log('filesData', filesData);
            console.log('iddddddddddd', id);
            const query = await this.fileUploadRepo.findOne({ where: { fileName: filesData[0].filename } });
            console.log(query, 'query');
            if (query) {
                throw new Error("File with same name already exists")
            }
            const fileObj = new FileUploadEntity();
            fileObj.featuresRefNo = id;
            fileObj.fileName = filesData[0].filename;
            fileObj.originalName = filesData[0].originalname;
            fileObj.filePath = filesData[0].path;
            fileObj.featuresRefName = ReferenceFeatures.KR
            fileObj.fileDescription = ReferenceFeatures.KR
            fileObj.type = ReferenceFeatures.KR;
            const save = await this.fileUploadRepo.save(fileObj);
            return new CommonResponseModel(true, 65433, "FileUploaded Successfully", save);
        } catch (error) {
            return new CommonResponseModel(false, 33565, error.message);
        }
    }

    async removeKRUploadDocument(fileid: string) {
        console.log('deleting the file with id:', fileid);
        const findExistedFile = await this.fileUploadRepo.findOne({ where: { fileUploadId: fileid } })
        if (findExistedFile?.fileName) {
            const path = join(__dirname, '../../../', 'kr_upload_images', findExistedFile?.fileName)
            if (fs.existsSync(path)) {
                fs.unlinkSync(path)
            }
        }
        console.log('path:', fileid);
        return await this.fileUploadRepo.delete(fileid);
    }

}
