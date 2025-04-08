import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoController } from './memo.controller';
import { MemoEntity } from './memo.entity';
import { MemoRepository } from './memo.repo';
import { MemoService } from './memo.service';


@Module({
    imports: [TypeOrmModule.forFeature([MemoEntity])],
    controllers: [MemoController],
    providers: [MemoService, MemoRepository, ApplicationExceptionHandler],
})
export class MemoModule { }
