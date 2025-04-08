import { Injectable } from '@nestjs/common';
import { UnitDto } from './dto/units.dto';
import { UnitEntity } from './entities/units.entity';
import { Client } from '../organization/entities/organization.entity';
import { GetAllUnitDto, GetAllUnitDropDownDto } from '@hrexpert/shared-models';


@Injectable()
export class UnitAdapter {
    convertDtoToEntity(unitDto: UnitDto): UnitEntity {
        const entity = new UnitEntity();
        entity.name = unitDto.name;
        entity.description = unitDto.description;
        const org = new Client();
        org.id = unitDto.organizationId;
        entity.client = org;
        if (unitDto.unitId) {
            entity.id = unitDto.unitId;
        }
        return entity;
    }
    convertEntityToDto(req: UnitEntity): GetAllUnitDto {
        const dto = new GetAllUnitDto(req.id, req.name, req.description, req.client?.id, req.client?.name, req.isActive, req.versionFlag);
        return dto;
    }

    convertDropDownEntityToDto(req: UnitEntity): GetAllUnitDropDownDto {
        const dto = new GetAllUnitDropDownDto(req.name, req.id);
        return dto;
    }
}

