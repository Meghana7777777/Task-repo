import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationExceptionHandler } from "@hrexpert/backend-utils";
import { DocumentTypeEntity } from "./entity/document-type.entity";
import { DocumentTypeController } from "./document-type.controller";
import { DocumentTypeService } from "./document-type.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            DocumentTypeEntity
        ])
    ],
    controllers: [DocumentTypeController],
    providers: [DocumentTypeService, ApplicationExceptionHandler]
})
export class DocumentTypeMOdule { }