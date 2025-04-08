import { Injectable } from "@nestjs/common";
import { OrganizationDto } from "../dtos/organization.dto";
import { Client } from "../entities/organization.entity";
import { GetAllOrganizations, DropdownOrganizationDto } from "@hrexpert/shared-models";



@Injectable()
export class OrganizationAdapter {
    convertDtoToEntity(orgDto: OrganizationDto): Client {
        const entity = new Client();
        entity.name = orgDto.name;
        entity.description = orgDto.description;
        if (orgDto.organizationId) {
            entity.id = orgDto.organizationId;
        }
        return entity;
    }

    convertEntityToDto(req: Client): GetAllOrganizations {
        const dto = new GetAllOrganizations(req.name ,req.description,req.id,req.versionFlag,req.isActive );
        return dto;
    }
    convertDropDownEntityToDto(req: Client): DropdownOrganizationDto {
        const dto = new DropdownOrganizationDto(req.name, req.id);
        return dto;
    }

}