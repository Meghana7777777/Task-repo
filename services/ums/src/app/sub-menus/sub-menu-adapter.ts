
import { Injectable } from '@nestjs/common';
import { SubMenuEntity } from './entities/sub-menus.entity';
import { ModulesEntity } from '../modules/entities/modules.entity';
import { ApplicationEntity } from '../applications/entities/application.entity';
import { MenusEntity } from '../menus/entities/menus.entity';
import { SubMenuDto, SubMenuDropDownDto } from '@hrexpert/shared-models';

@Injectable()
export class SubMenuAdapter {
    convertDtoToEntity(subMenuDto: SubMenuDto): SubMenuEntity {
        const entity = new SubMenuEntity();
        entity.name = subMenuDto.name;
        entity.order = subMenuDto.order;
        entity.iconType = subMenuDto.iconType;
        entity.iconName = subMenuDto.iconName;
        entity.path = subMenuDto.path;
        entity.component = subMenuDto.component;
        entity.isOnlyRouting = subMenuDto.isOnlyRouting ? true : false;
        const module = new ModulesEntity();
        module.id = subMenuDto.moduleId;
        entity.module = module;
        const application = new ApplicationEntity();
        application.id = subMenuDto.applicationId;
        entity.application = application;
        const menu = new MenusEntity();
        menu.id = subMenuDto.menuId;
        entity.menu = menu;
        if (subMenuDto.parentId) {
            const subEntity = new SubMenuEntity();
            subEntity.id = subMenuDto.parentId;
            entity.parent = subEntity;
        }
        if (subMenuDto.subMenuId) {
            entity.id = subMenuDto.subMenuId;
            entity.updatedUser = subMenuDto.username;
        } else {
            entity.createdUser = subMenuDto.username;
        }
        return entity;
    }
    convertEntityToDto(req: SubMenuEntity): SubMenuDto {
        const dto = new SubMenuDto(undefined, undefined, req.id, req.name, req.order, req.iconType, req.iconName, req.path, req.component, req.parent?.id, req.parent?.name, req.menu.id, req.menu.name, req.module.id, req.module.name, req.application.id, req.application.applicationName, req.isActive, req.versionFlag);
        return dto;
    }

    convertDropDownEntityToDto(req: SubMenuEntity): SubMenuDropDownDto {
        const dto = new SubMenuDropDownDto(req.name, req.id);
        return dto;
    }
}

