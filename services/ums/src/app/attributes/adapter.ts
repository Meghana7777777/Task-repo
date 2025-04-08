import { Injectable } from "@nestjs/common";
import { AttributeDto } from "./dtos/attribute.dto";
import { AttributesEntity } from "./entities/attributes.entity";
import { GetAllAttributeDropDown, GetAllAttributeDto } from "@hrexpert/shared-models";


@Injectable()
export class AttributesAdapter {
    convertDtoToEntity(atbDto: AttributeDto): AttributesEntity {
        const entity = new AttributesEntity();
        entity.attributeName = atbDto.attributeName;
        if (atbDto.attributeId) {
            entity.id = atbDto.attributeId;
        }
        return entity;
    }
    convertEntityToDto(req: AttributesEntity): GetAllAttributeDto {
        const dto = new GetAllAttributeDto(req.attributeName, req.id, req.isActive, req.versionFlag);
        return dto;
    }

    convertDropDownEntityToDto(req: AttributesEntity): GetAllAttributeDropDown {
        const dto = new GetAllAttributeDropDown(req.attributeName, req.id);
        return dto;
    }

}