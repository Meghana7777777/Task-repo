import { Injectable } from '@nestjs/common';
import { RolePermDto } from './dto/role_permissions.dto';
import { RolePermissionEntity } from './entities/role-permissions.entity';
import { PermissionsEntity } from '../permissions/entities/permissions.entity';
import { RolesEntity } from '../roles/entities/roles.entity';
import { RolePermissionDto } from '@hrexpert/shared-models';



@Injectable()
export class RolePermsAdapter {
    convertDtoToEntity(rolePerm: RolePermDto): RolePermissionEntity[] {
        const entities = []
        rolePerm.permissionIds.forEach(rec => {
            const entity = new RolePermissionEntity();
            const permissions = new PermissionsEntity();
            permissions.id = rec;
            entity.permission = permissions;
            const roles = new RolesEntity();
            roles.id = rolePerm.roleId;
            entity.role = roles;
            entities.push(entity)
        })
        return entities
    }

    convertEntityToDto(rolePermDto: RolePermissionEntity): RolePermissionDto {
        return new RolePermissionDto(undefined, undefined, rolePermDto.id, rolePermDto.permission.id, rolePermDto.permission.name, rolePermDto.permission.subMenu.id, rolePermDto.permission.subMenu.name, rolePermDto.permission.scope.id, rolePermDto.permission.scope.name, rolePermDto.role.id, rolePermDto.role.name, rolePermDto.isActive, rolePermDto.versionFlag)
    }



}