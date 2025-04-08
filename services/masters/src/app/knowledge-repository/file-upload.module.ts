import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { FileUploadEntity } from './entities/file-upload.entity';
import { FileUploadLogEntity } from './entities/file-upload-log.entity';
import { FileHandlingController } from './file-upload.controller';
import { FileHandlingService } from './file-upload.service';
import { FileUploadLogRepo } from './repos/file-upload-log-repo';
import { FileUploadRepo } from './repos/file-upload-repo';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

// const filesDestination = './kr_upload_images';
// if (!fs.existsSync(filesDestination)) {
//     fs.mkdirSync(filesDestination);
// }

@Module({
    imports: [
        TypeOrmModule.forFeature([FileUploadEntity, FileUploadLogEntity]),
        // ServeStaticModule.forRootAsync({
        //     useFactory: () => {
        //         return [
        //             {
        //                 rootPath: join(__dirname, '../../../../../kr_upload_images'),
        //                 // exclude: ['/api*'],
        //                 serveRoot: '/api',
        //                 // serveStaticOptions: {
        //                 //   redirect: true,
        //                 //   index: false,
        //                 // }
        //             }
        //         ]
        //     }
        // }),
    ],
    controllers: [FileHandlingController],
    providers: [FileHandlingService, FileUploadLogRepo, FileUploadRepo, ApplicationExceptionHandler],
    exports: [FileHandlingService],
})
export class FileHandlingModule { }
