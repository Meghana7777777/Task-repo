import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FileUploadLogEntity } from '../entities/file-upload-log.entity';

@Injectable()
export class FileUploadLogRepo extends Repository<FileUploadLogEntity> {
    constructor(private dataSource: DataSource) {
        super(FileUploadLogEntity, dataSource.createEntityManager());
    }
}
