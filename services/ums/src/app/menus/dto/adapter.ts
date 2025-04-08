import { Injectable } from '@nestjs/common';
import { MenusEntity } from '../entities/menus.entity';
import { ModulesEntity } from '../../modules/entities/modules.entity';
import { ApplicationEntity } from '../../applications/entities/application.entity';
import { MenusDto, MenusDropdownDto } from '@hrexpert/shared-models';


@Injectable()
export class MenuAdapter {
    convertDtoToEntity(menuDto: MenusDto): MenusEntity {
        const entity = new MenusEntity;
        entity.name = menuDto.menuName;
        entity.order = menuDto.order;
        entity.iconType = menuDto.iconType;
        entity.iconName = menuDto.iconName;
        entity.path = menuDto.path;
        entity.component = menuDto.component;
        const module = new ModulesEntity();
        module.id = menuDto.moduleId;
        entity.module = module;
        const application = new ApplicationEntity();
        application.id = menuDto.applicationId;
        entity.application = application;
        if (menuDto.menuId) {
            entity.id = menuDto.menuId;
            entity.updatedUser = menuDto.username;
        } else {
            entity.createdUser = menuDto.username;
        }
        return entity;
    }

    convertEntityToDto(req: MenusEntity): MenusDto {
        const dto = new MenusDto(undefined, undefined, req.id, req.name, req.order, req.iconType, req.iconName, req.path, req.component, req.isActive, req.versionFlag, req.module.id, req.module.name, req.application.id, req.application.applicationName)
        return dto;
    }

    convertDropdownEntityToDto(req: MenusEntity): MenusDropdownDto {
        const dto = new MenusDropdownDto(req.name, req.id)
        return dto;
    }
}
