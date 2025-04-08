import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common/decorators';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
// import {
//   FeatureFilesReqModel,
//   GlobalResponseObject,
//   ReferenceFeatures
// } from '@shahi-unit-12-apps/shared-models';
import { diskStorage } from 'multer';
import { join } from 'path';
import { FileHandlingService } from './file-upload.service';
import { FeatureFilesReqModel, GlobalResponseObject, ReferenceFeatures, ApplicationExceptionHandler } from '@hrexpert/shared-models';

console.log(join(__dirname, '../../../', 'kr_upload_images'), ">...........")

@ApiTags('/file-handling')
@Controller('/file-handling')
export class FileHandlingController {
    constructor(
        private fileHandlingService: FileHandlingService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler

    ) { }

    // @Post('deleteSingleFile')
    // async deleteSingleFile(
    //   @Body() req: FileUploadIdReq
    // ): Promise<GlobalResponseObject> {
    //   console.log(req, 'oooo');
    //   try {
    //     return await this.fileHandlingService.deleteSingleFile(req);
    //   } catch (error) {
    //     return returnException(GlobalResponseObject, error);
    //   }
    // }

    @Post('/getSavedFilesData')
    async getSavedFilesData(
        @Body() req: FeatureFilesReqModel
    ): Promise<GlobalResponseObject> {
        try {
            return await this.fileHandlingService.getSavedFilesData(
                req.featuresRefId,
                req.featuresRefName,
                true
            );
        } catch (error) {
            return this.applicationExceptionHandler.returnException(GlobalResponseObject, error);
        }
    }

    @Post('/fileUpload')
    @UseInterceptors(FilesInterceptor('file', 10, {
        storage: diskStorage({
            destination: join(__dirname, '../../../', 'kr_upload_images'),
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
    }))
    async fileUpload(@UploadedFiles() file: File[], @Body() uploadData: any): Promise<any> {
        console.log(join('../../../', 'kr_upload_images'), uploadData)
        try {
            return await this.fileHandlingService.save(file, uploadData.createdUser, uploadData.featuresRefName, uploadData.id)
        } catch (error) {
            return this.applicationExceptionHandler.returnException(GlobalResponseObject, error);
        }
    }


    @Post('/sampleStyleUpload')
    @UseInterceptors(FilesInterceptor('file', 1, {
        storage: diskStorage({
            destination: join('../../../', 'kr_upload_images'),
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
    }))
    async sampleStyleUpload(@UploadedFiles() file: File[], @Body() uploadData: any): Promise<any> {
        try {
            return await this.fileHandlingService.sampleStyleUpload(file, uploadData.createdUser, ReferenceFeatures.KR)
        } catch (error) {
            return this.applicationExceptionHandler.returnException(GlobalResponseObject, error);
        }
    }

}
// function FilesInterceptor(arg0: string, arg1: number, arg2: { storage: any; fileFilter: (req: any, file: any, callback: any) => any; }): Function | import("@nestjs/common").NestInterceptor<any, any> {
//   throw new Error('Function not implemented.');
// }

// function diskStorage(arg0: {
//   // destination: './upload-files/manisha-123',
//   // destination: `./upload-files/PO-${req}`,
//   destination: (req: any, file: any, callback: any) => void;
//   // destination: (req, file, callback) => {
//   //   callback(null, `./upload-files/PO-${req.body.customerPo}`);
//   // },
//   filename: (req: any, file: any, callback: any) => void;
// }): any {
//   throw new Error('Function not implemented.');
// }

