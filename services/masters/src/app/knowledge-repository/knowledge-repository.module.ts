import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { DocumentService } from './knolwedge-repository.service';
import { DocumentController } from './knowledge-repository.controller';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { FileUploadRepo } from './repos/file-upload-repo';
import { FileUploadEntity } from './entities/file-upload.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DocumentEntity, FileUploadEntity])],
    providers: [DocumentService, ApplicationExceptionHandler, FileUploadRepo],
    controllers: [DocumentController],
})
export class DocumentModule { }
