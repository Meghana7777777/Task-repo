import { Injectable } from '@nestjs/common';
import { UserRolesEntity } from '../entitys/user-roles.entity';
import { UserEntity } from '../../users/entities/users.entity';
import { RolesEntity } from '../../roles/entities/roles.entity';
import { UserRoleDto } from '@hrexpert/shared-models';

@Injectable()
export class UserRolesAdapter {
    convertDtoToEntity(roleDto: UserRoleDto): UserRolesEntity {
        const entity = new UserRolesEntity();
        const user = new UserEntity();
        user.id = roleDto.usersId;
        entity.user = user;
        const roles = new RolesEntity();
        roles.id = roleDto.rolesId;
        entity.role = roles;
        if (roleDto.userRoleId) {
            entity.id = roleDto.userRoleId;
        }
        return entity;
    }
    convertEntitytoDto(req: UserRolesEntity): UserRoleDto {
        const dto = new UserRoleDto(undefined, undefined, req.id, req.user.id, req.role.id, req.role.name, req.isActive, req.versionFlag, undefined);
        return dto;
    }

}
