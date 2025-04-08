import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  Get,
  Delete,
  Body,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ExpensesFileService } from './expenses-file.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { ApiTags } from '@nestjs/swagger';
import {
  ApplicationExceptionHandler,
  ExpensesFeatureFilesReqModel,
  FeatureFilesReqModel,
  GlobalResponseObject,
} from '@hrexpert/shared-models';
import { join } from 'path';
import { Express } from 'express';

console.log(join(__dirname, '../../../', 'expenses_upload_files'), ">...........")

@ApiTags('/expenses-files')
@Controller('/expenses-files')
export class ExpensesFileController {
  constructor(
    private expensesFileService: ExpensesFileService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('/getExpenseSavedFilesData')
  async getExpenseSavedFilesData(
    @Body() req: ExpensesFeatureFilesReqModel
  ): Promise<GlobalResponseObject> {
    try {
      return await this.expensesFileService.getExpenseSavedFilesData(
        req.featuresRefId,
        req.featuresRefName,
        true
      );
    } catch (error) {
      return this.applicationExceptionHandler.returnException(
        GlobalResponseObject,
        error
      );
    }
  }

  @Post('/expensesFileUpload')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: join(__dirname, '../../../', 'expenses_upload_files'),
        filename: (req, file, callback) => {
          console.log(file.originalname);
          const name = file.originalname;
          callback(null, `${name}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(xlsx|xls|pdf|jpg|png|jpeg|doc|PDF|ppt|pptx|doc|docx|csv|zip|gif)$/)) {
          return callback(new Error('Only xlsx,xls,pdf, jpg, png, doc, jpeg files are allowed!'), false);
        }
        callback(null, true);
      },
    })
  )
  async expensesFileUpload(@UploadedFiles() files: File[], @Body() uploadData: any): Promise<any> {
    console.log(join('../../../', 'expenses_upload_files'), uploadData);
    console.log('Received files:', files);
    console.log('Upload data:', uploadData);
    try {
      return await this.expensesFileService.save(
        files,
        uploadData.createdUser,
        uploadData.featuresRefName,
        uploadData.id
      );
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GlobalResponseObject, error);
    }
  }


  @Post('/sampleStyleUpload')
  @UseInterceptors(
    FilesInterceptor('file', 1, {
      storage: diskStorage({
        destination: join('../../../', 'expenses_upload_files'),
        filename: (req, file, callback) => {
          console.log(file.originalname);
          const name = file.originalname;
          callback(null, `${name}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
          return callback(new Error('Only jpg, png, doc, jpeg files are allowed!'), false);
        }
        callback(null, true);
      },
    })
  )
  async sampleStyleUpload(@UploadedFiles() file: File[], @Body() uploadData: any): Promise<any> {
    console.log(uploadData, '***********************************8');

    try {
      return await this.expensesFileService.sampleStyleUpload(
        file, uploadData.createdUser);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(
        GlobalResponseObject,
        error
      );
    }
  }
}
