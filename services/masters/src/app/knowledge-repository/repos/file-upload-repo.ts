import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FileUploadEntity } from '../entities/file-upload.entity';

@Injectable()
export class FileUploadRepo extends Repository<FileUploadEntity> {
    constructor(private dataSource: DataSource) {
        super(FileUploadEntity, dataSource.createEntityManager());
    }
}
