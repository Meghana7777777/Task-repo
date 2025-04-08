import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ExpensesFileEntity } from './entity/expenses-file.entity';
import { ExpensesFileRepository } from './repo/expenses-file.repository';
import { ExpensesFileLogEntity } from './entity/expenses-file-log.entity';
import {
  ExpensesFeatures,
  GlobalResponseObject,
  ReferenceFeatures,
} from '@hrexpert/shared-models';
import { GenericTransactionManager } from '../../database/type-orm-transactions';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { ExpenseFileUploadIdReq } from './dto/expenses-upload-model.dto';
import { ExpensesFileLogRepository } from './repo/expenses-file-log.repository';

@Injectable()
export class ExpensesFileService {
  constructor(
    private dataSource: DataSource,
    private expensesFileRepository: ExpensesFileRepository,
    private readonly expensesFileLogRepository: ExpensesFileLogRepository
  ) { }

  // private uploadDir = path.join(__dirname, '../../../', 'expenses_upload_files');

  // Save multiple files in the database

  async save(
    filesData: any[],
    createdUser: string,
    featuresRefName: ExpensesFeatures,
    featuresRefId: number,
    transactionalEntityManager?: GenericTransactionManager
  ): Promise<ExpensesFileEntity[]> {
    try {
      const fileExpenseEntities: ExpensesFileEntity[] = [];
      filesData.forEach((file) => {
        const fileObj = new ExpensesFileEntity();
        fileObj.fileName = file.filename;
        fileObj.originalName = file.originalname;
        fileObj.size = file.size;
        fileObj.filePath = file.path;
        fileObj.featuresRefNo = featuresRefId;
        fileObj.featuresRefName = featuresRefName;
        fileObj.fileUploadId = file.fileUploadId;
        fileObj.type = featuresRefName;
        fileObj.fileDescription = featuresRefName;
        fileObj.lastModified = '';
        fileObj.lastModifiedDate = '';
        fileExpenseEntities.push(fileObj);
      });

      if (transactionalEntityManager) {
        const savedFileData = await transactionalEntityManager
          .getRepository(ExpensesFileEntity)
          .save(fileExpenseEntities);
        return savedFileData;
      } else {
        const savedFileData = await this.expensesFileRepository.save(
          fileExpenseEntities
        );
        return savedFileData;
      }
    } catch (error) {
      console.log(error);
      for (const file of filesData) {
        const filePath = path.join(file.destination, file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      throw error;
    }
  }

  // Retrieve files for an expense
  async getExpenseSavedFilesData(
    featuresRefId: number,
    featuresRefName: string,
    returnCommonResponse?: boolean
  ): Promise<any> {
    const filesData = await this.expensesFileRepository.find({
      where: { featuresRefNo: featuresRefId },
    });
    const filesDestination = '../../../../../expenses_upload_files';
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

  // Delete a file
  async deleteFile(
    featuresRefId: number,
    transactionalEntityManager?: GenericTransactionManager
  ) {
    if (transactionalEntityManager) {
      await transactionalEntityManager
        .getRepository(ExpensesFileEntity)
        .delete({ featuresRefNo: featuresRefId });
      return new GlobalResponseObject(true, 123, 'deleted successfully');
    } else {
      await this.expensesFileRepository.delete({
        featuresRefNo: featuresRefId,
      });
      return new GlobalResponseObject(true, 123, 'deleted successfully');
    }
  }

  async deleteSingleFile(
    req: ExpenseFileUploadIdReq,
    transactionalEntityManager?: GenericTransactionManager
  ): Promise<GlobalResponseObject> {
    const { fileUploadId, unitCode, createdUser } = req;
    const fileData = await this.expensesFileRepository.findOne({
      where: { fileUploadId },
    });
    if (fs.existsSync(fileData.filePath)) {
      fs.unlinkSync(fileData.filePath);
    }
    if (transactionalEntityManager) {
      await transactionalEntityManager
        .getRepository(ExpensesFileEntity)
        .delete({ fileUploadId });
      await transactionalEntityManager
        .getRepository(ExpensesFileLogEntity)
        .insert(fileData);
    } else {
      await this.expensesFileRepository.delete({ fileUploadId });
      await this.expensesFileLogRepository.insert(fileData);
    }
    return new GlobalResponseObject(true, 123, 'deleted successfully');
  }

  // Save sample style upload

  async sampleStyleUpload(
    filesData: any[],
    // createdUser: string,
    featuresRefName: ExpensesFeatures,
    transactionalEntityManager?: GenericTransactionManager
  ): Promise<ExpensesFileEntity[]> {
    try {
      const fileEntities: ExpensesFileEntity[] = [];

      filesData.forEach((file) => {
        const fileObj = new ExpensesFileEntity();
        fileObj.fileName = file.filename;
        fileObj.originalName = file.originalname;
        fileObj.size = file.size;
        fileObj.filePath = file.path;
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
        const savedFileData = await transactionalEntityManager
          .getRepository(ExpensesFileEntity)
          .save(fileEntities);
        return savedFileData;
      } else {
        const savedFileData = await this.expensesFileRepository.save(
          fileEntities
        );
        return savedFileData;
      }
    } catch (error) {
      console.log(error);
      for (const file of filesData) {
        const filePath = path.join(file.destination, file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      throw error;
    }
  }

  async swapFileUploads(
    originalFeaturesRef: number,
    versionFeaturesRef: number,
    manger?: GenericTransactionManager
  ) {
    const transactionalManager = manger
      ? manger
      : new GenericTransactionManager(this.dataSource);
    try {
      const originalFiles = await this.expensesFileRepository.find({
        select: ['fileUploadId'],
        where: { featuresRefNo: originalFeaturesRef },
      });
      const originalFileIds = originalFiles.map((rec) => rec.fileUploadId);
      const versionFiles = await this.expensesFileRepository.find({
        select: ['fileUploadId'],
        where: { featuresRefNo: versionFeaturesRef },
      });
      const versionFileIds = versionFiles.map((rec) => rec.fileUploadId);
      if (!manger) await transactionalManager.startTransaction();
      await transactionalManager
        .getRepository(ExpensesFileEntity)
        .update(
          { fileUploadId: In([...originalFileIds]) },
          {
            featuresRefNo: versionFeaturesRef,
            featuresRefName: ExpensesFeatures.ER,
          }
        );
      await transactionalManager
        .getRepository(ExpensesFileEntity)
        .update(
          { fileUploadId: In([...versionFileIds]) },
          {
            featuresRefNo: originalFeaturesRef,
            featuresRefName: ExpensesFeatures.ER,
          }
        );
      if (!manger) await transactionalManager.completeTransaction();
      return new CommonResponse(
        true,
        123,
        'Work Order Files Swapped Successfully'
      );
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
    // featuresRefName: ReferenceFeatures,
    transactionalEntityManager: GenericTransactionManager
  ): Promise<any> {
    const filesData = await transactionalEntityManager
      .getRepository(ExpensesFileEntity)
      .find({ where: { featuresRefNo: featuresRefId } });
    const filesDestination = '../../../../../expenses_upload_files';
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
      file.fileUploadId = fileData.fileUploadId;
      file.featuresRefId = featuresRefId;
      file.base64Url = '';
      filesResData.push(file);
    }
    return filesResData;
  }
}
