import { Injectable } from "@nestjs/common";
import { ModulesEntity } from "./entities/modules.entity";
import { ApplicationEntity } from "../applications/entities/application.entity";
import { ModuleDto, ModulesDropDownDto } from "@hrexpert/shared-models";


@Injectable()
export class ModulesAdapter {
    convertDtoToEntity(aplDto: ModuleDto): ModulesEntity {
        const entity = new ModulesEntity();
        entity.name = aplDto.moduleName;
        entity.description = aplDto.moduleDescription;
        const application = new ApplicationEntity();
        application.id = aplDto.applicationId;
        entity.application = application;
        if (aplDto.moduleId) {
            entity.id = aplDto.moduleId;
        }
        return entity;
    }



    convertEntityToDto(req: ModulesEntity): ModuleDto {
        const dto = new ModuleDto(undefined, undefined, req.id, req.name, req.description, req.application.id, req.application.applicationName, req.isActive, req.versionFlag);
        return dto;
    }



    convertDropDownEntityToDto(req: ModulesEntity): ModulesDropDownDto {
        const dto = new ModulesDropDownDto(req.name, req.id);
        return dto;
    }




}