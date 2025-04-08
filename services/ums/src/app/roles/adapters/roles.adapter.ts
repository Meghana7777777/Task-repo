import { Injectable } from '@nestjs/common';
import { RolesDto } from '../dtos/roles.dto';
import { RolesEntity } from '../entities/roles.entity';
import { UnitEntity } from '../../units/entities/units.entity';
import { GetAllRolesDto, GetAllRolesDropDown } from '@hrexpert/shared-models';


@Injectable()
export class RolesAdapter {
    convertDtoToEntity(roleDto: RolesDto): RolesEntity {
        const entity = new RolesEntity();
        entity.name = roleDto.roleName;
        entity.description = roleDto.description;
        const unit = new UnitEntity();
        unit.id = roleDto.unitId;
        entity.unit = unit;
        if (roleDto.rolesId) {
            entity.id = roleDto.rolesId;
        }
        return entity;
    }
    convertEntityToDto(req: RolesEntity): GetAllRolesDto {
        const dto = new GetAllRolesDto(req.name, req.id, req.description, req.unit.id, req.unit.name, req.isActive, req.versionFlag);
        return dto;
    }

    convertDropDownEntityToDto(req: RolesEntity): GetAllRolesDropDown {
        const dto = new GetAllRolesDropDown(req.name, req.id);
        return dto;
    }
}
