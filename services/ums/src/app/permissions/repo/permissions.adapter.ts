import { PermissionsDto, DropdownPermissionsDto } from "@hrexpert/shared-models";
import { ApplicationEntity } from "../../applications/entities/application.entity";
import { ModulesEntity } from "../../modules/entities/modules.entity";
import { ScopesEntity } from "../../scopes/entites/scopes.entity";
import { SubMenuEntity } from "../../sub-menus/entities/sub-menus.entity";
import { PermissionsEntity } from "../entities/permissions.entity";


export class PermissionAdapter {
    convertEntityToDto(dto: PermissionsDto): PermissionsEntity {
        const entity = new PermissionsEntity();
        entity.name = dto.name;
        entity.id = dto.permissionId;
        const scope = new ScopesEntity();
        scope.id = dto.scopeId
        entity.scope = scope;
        const application = new ApplicationEntity();
        application.id = dto.applicationId;
        entity.application = application;
        const module = new ModulesEntity();
        module.id = dto.moduleId;
        entity.module = module;
        const subMenu = new SubMenuEntity();
        subMenu.id = dto.subMenuId;
        entity.subMenu = subMenu;
        if (dto.permissionId) {
            entity.id = dto.permissionId;
            entity.updatedUser = dto.username;
        } else {
            entity.createdUser = dto.username;
        }
        return entity
    }
    convertDtoToEntity(per: PermissionsEntity): PermissionsDto {
        const dto = new PermissionsDto(undefined, undefined, per.id, per.name, per.subMenu.id, per.subMenu.name, per.scope.id, per.scope.name, per.versionFlag, per.isActive, per.module.id, per.module.name, per.application.id, per.application.applicationName)
        return dto;
    }
    convertDropdownEntityToDto(perm: PermissionsEntity): DropdownPermissionsDto {
        const dto = new DropdownPermissionsDto(perm.id, perm.name);
        return dto;
    }
}

