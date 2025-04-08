
import { Injectable } from "@nestjs/common";
import { ApplicationsDto } from "../dto/applications.dto";
import { ApplicationEntity } from "../entities/application.entity";
import { ApplicationsDropDownDto, GetAllApplicationsDto } from "@hrexpert/shared-models";


@Injectable()
export class ApplicationsAdapter {
    convertDtoToEntity(aplDto: ApplicationsDto): ApplicationEntity {
        const entity = new ApplicationEntity();
        entity.applicationName = aplDto.applicationName;
        entity.description = aplDto.description;
        if (aplDto.applicationId){
            entity.id = aplDto.applicationId;
        }
        return entity;
    }
    convertEntityToDto(req: ApplicationEntity): GetAllApplicationsDto {
        const dto = new GetAllApplicationsDto(req.applicationName, req.id,req.description, req.isActive, req.versionFlag);
        return dto;
    }

    convertDropDownEntityToDto(req: ApplicationEntity): ApplicationsDropDownDto {
        const dto = new ApplicationsDropDownDto(req.applicationName, req.id);
        return dto;
    }

}