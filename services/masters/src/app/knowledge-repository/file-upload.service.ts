import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import path from 'path';
import { DataSource, In } from 'typeorm';
import { FileUploadRepo } from './repos/file-upload-repo';
import { FileUploadLogRepo } from './repos/file-upload-log-repo';
import { GlobalResponseObject, ReferenceFeatures } from '@hrexpert/shared-models';
import { GenericTransactionManager } from '../../database/type-orm-transactions';
import { FileUploadEntity } from './entities/file-upload.entity';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { FileUploadIdReq } from './dto/file-upload-model.dto';
import { FileUploadLogEntity } from './entities/file-upload-log.entity';

@Injectable()
export class FileHandlingService {
    constructor(
        private dataSource: DataSource,
        private filesRepo: FileUploadRepo,
        private fileUploadLogsRepo: FileUploadLogRepo
    ) { }

    async save(filesData: any[], createdUser: string, featuresRefName: ReferenceFeatures, featuresRefId: number, transactionalEntityManager?: GenericTransactionManager): Promise<FileUploadEntity[]> {
        console.log(featuresRefId, 'featuresRefId');

        try {
            const fileEntities: FileUploadEntity[] = [];
            filesData.forEach((file, index) => {
                const fileObj = new FileUploadEntity();
                const fileEntityKeys = Object.keys(file);
                Object.keys(file).forEach((key) => {
                    if (fileEntityKeys.includes(key)) {
                        fileObj[key] = file[key];
                    }
                });
                fileObj.fileName = file.filename
                fileObj.originalName = file.originalname
                fileObj.size = file.size
                fileObj.filePath = file.path;
                fileObj.featuresRefName = featuresRefName;
                fileObj.featuresRefNo = featuresRefId;
                fileObj.fileUploadId = file.fileUploadId;
                fileObj.type = featuresRefName;
                fileObj.fileDescription = featuresRefName;
                fileObj.lastModified = '';
                fileObj.lastModifiedDate = '';
                fileEntities.push(fileObj);
            });

            if (transactionalEntityManager) {
                const savedFileData = await transactionalEntityManager.getRepository(FileUploadEntity).save(fileEntities);
                return savedFileData;
            } else {
                const savedFileData = await this.filesRepo.save(fileEntities);
                return savedFileData;
            }
        } catch (error) {
            console.log(error)
            for (const file of filesData) {
                const filePath = path.join(file.destination, file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            throw error
        }
    }

    async getSavedFilesData(
        featuresRefId: number,
        featuresRefName: ReferenceFeatures,
        returnCommonResponse?: boolean
    ): Promise<any> {
        const filesData = await this.filesRepo.find({ where: { featuresRefNo: featuresRefId, featuresRefName }, });
        const filesDestination = '../../../../../kr_upload_images';
        if (!fs.existsSync(filesDestination)) {
            fs.mkdirSync(filesDestination);
        }
        const filesResData = [];
        for (const fileData of filesData) {
            let file: any = {};
            file.name = fileData.originalName;
            file.uid = fileData.fileName;
            file.size = fileData.size;
            file.type = fileData.type;
            file.fileDescription = fileData.fileDescription;
            file.filePath = fileData.filePath;
            file.lastModified = fileData.lastModified;
            file.lastModifiedDate = fileData.lastModifiedDate;
            file.percent = fileData.percent;
            file.fileUploadId = fileData.fileUploadId;
            file.featuresRefId = featuresRefId;
            file.base64Url = '';
            filesResData.push(file);
        }
        if (returnCommonResponse) {
            return new CommonResponse(true, 123, '', filesResData);
        }
        return filesResData;
    }

    async deleteFilesData(featuresRefId: number, featuresRefName: ReferenceFeatures, transactionalEntityManager?: GenericTransactionManager) {
        if (transactionalEntityManager) {
            await transactionalEntityManager.getRepository(FileUploadEntity).delete({ featuresRefName, featuresRefNo: featuresRefId });
            return new GlobalResponseObject(true, 123, 'deleted successfully');
        } else {
            await this.filesRepo.delete({ featuresRefName, featuresRefNo: featuresRefId });
            return new GlobalResponseObject(true, 123, 'deleted successfully');
        }
    }

    async deleteSingleFile(req: FileUploadIdReq, transactionalEntityManager?: GenericTransactionManager): Promise<GlobalResponseObject> {

        const { fileUploadId, unitCode, createdUser } = req;
        const fileData = await this.filesRepo.findOne({ where: { fileUploadId } });
        if (fs.existsSync(fileData.filePath)) {
            fs.unlinkSync(fileData.filePath);
        }
        if (transactionalEntityManager) {
            await transactionalEntityManager.getRepository(FileUploadEntity).delete({ fileUploadId });
            await transactionalEntityManager.getRepository(FileUploadLogEntity).insert(fileData);
        } else {
            await this.filesRepo.delete({ fileUploadId });
            await this.fileUploadLogsRepo.insert(fileData);
        }
        return new GlobalResponseObject(true, 123, 'deleted successfully');

    }

    async sampleStyleUpload(filesData: any[], createdUser: string, featuresRefName: ReferenceFeatures, transactionalEntityManager?: GenericTransactionManager): Promise<FileUploadEntity[]> {
        try {

            const fileEntities: FileUploadEntity[] = [];
            filesData.forEach((file, index) => {
                const fileObj = new FileUploadEntity();
                const fileEntityKeys = Object.keys(file);
                Object.keys(file).forEach((key) => {
                    if (fileEntityKeys.includes(key)) {
                        fileObj[key] = file[key];
                    }
                });
                fileObj.fileName = file.filename
                fileObj.originalName = file.originalname
                fileObj.size = file.size
                fileObj.filePath = file.path

                fileObj.featuresRefName = featuresRefName;
                fileObj.featuresRefNo = 0;
                fileObj.fileUploadId = file.fileUploadId;
                fileObj.type = featuresRefName;
                fileObj.fileDescription = featuresRefName;
                fileObj.lastModified = '';
                fileObj.lastModifiedDate = '';
                fileEntities.push(fileObj);
            });

            if (transactionalEntityManager) {
                const savedFileData = await transactionalEntityManager.getRepository(FileUploadEntity).save(fileEntities);
                return savedFileData;
            } else {
                const savedFileData = await this.filesRepo.save(fileEntities);
                return savedFileData;
            }
        } catch (error) {
            console.log(error)
            for (const file of filesData) {
                const filePath = path.join(file.destination, file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            throw error
        }
    }

    async swapFileUploads(originalFeaturesRef: number, versionFeaturesRef: number, manger?: GenericTransactionManager) {
        const transactionalManager = manger ? manger : new GenericTransactionManager(this.dataSource);
        try {
            const originalFiles = await this.filesRepo.find({ select: ['fileUploadId'], where: { featuresRefNo: originalFeaturesRef } });
            const originalFileIds = originalFiles.map(rec => rec.fileUploadId);
            const versionFiles = await this.filesRepo.find({ select: ['fileUploadId'], where: { featuresRefNo: versionFeaturesRef } });
            const versionFileIds = versionFiles.map(rec => rec.fileUploadId);
            if (!manger)
                await transactionalManager.startTransaction();
            await transactionalManager.getRepository(FileUploadEntity).update({ fileUploadId: In([...originalFileIds]) }, { featuresRefNo: versionFeaturesRef, featuresRefName: ReferenceFeatures.KR });
            await transactionalManager.getRepository(FileUploadEntity).update({ fileUploadId: In([...versionFileIds]) }, { featuresRefNo: originalFeaturesRef, featuresRefName: ReferenceFeatures.KR });
            if (!manger)
                await transactionalManager.completeTransaction();
            return new CommonResponse(true, 123, 'Work Order Files Swapped Successfully',);
        } catch (error) {
            if (!manger) {
                if (transactionalManager)
                    await transactionalManager.releaseTransaction();
            }
            throw error;
        }
    }

    async getSavedFilesDataTransaction(
        featuresRefId: number,
        featuresRefName: ReferenceFeatures,
        transactionalEntityManager: GenericTransactionManager
    ): Promise<any> {
        const filesData = await transactionalEntityManager.getRepository(FileUploadEntity).find({ where: { featuresRefNo: featuresRefId, featuresRefName }, });
        const filesDestination = '../../../../../kr_upload_images';
        if (!fs.existsSync(filesDestination)) {
            fs.mkdirSync(filesDestination);
        }
        const filesResData = [];
        for (const fileData of filesData) {
            let file: any = {};
            file.name = fileData.originalName;
            file.uid = fileData.fileName;
            file.filename = fileData.originalName;
            file.originalname = fileData.fileName;
            file.size = fileData.size;
            file.type = fileData.type;
            file.fileDescription = fileData.fileDescription;
            file.filePath = fileData.filePath;
            file.lastModified = fileData.lastModified;
            file.lastModifiedDate = fileData.lastModifiedDate;
            file.percent = fileData.percent;
            file.fileUploadId = fileData.fileUploadId;
            file.featuresRefId = featuresRefId;
            file.base64Url = '';
            filesResData.push(file);
        }
        return filesResData;
    }
}
