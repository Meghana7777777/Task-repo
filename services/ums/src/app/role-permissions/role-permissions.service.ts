import { AppModuleSubMenuIdReqDto, GetAllRolePermissionsResponse, RolePermissionDto, RolesIdReqDto } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { In } from 'typeorm';
import { PermsService } from '../permissions/permissions.service';
import { RolesEntity } from '../roles/entities/roles.entity';
import { RolePermDto } from './dto/role_permissions.dto';
import { RolePermsRepository } from './repo/role-perm.repo';
import { RolePermsAdapter } from './role-permissions-adapter';

@Injectable()
export class RolePermissionsService {
  constructor(
    private readonly rolePermsRepo: RolePermsRepository,
    private readonly adapter: RolePermsAdapter,
    private readonly permService: PermsService
  ) { }

  async createRolePerm(rolePermDto: RolePermDto): Promise<CommonResponse> {
    const permissionsWithInSubMenu = await this.permService.getAllPermsBySubMenuModuleAndAppId(new AppModuleSubMenuIdReqDto(undefined, undefined, undefined, undefined, rolePermDto.subMenuId));

    if (permissionsWithInSubMenu.status) {
      const nonExistingIds = [];
      permissionsWithInSubMenu.data.forEach(rec => {
        if (!rolePermDto.permissionIds.includes(rec.permissionId)) {
          nonExistingIds.push(rec.permissionId);
        }
      });
      const role = new RolesEntity();
      role.id = rolePermDto.roleId;
      if (nonExistingIds.length) {
        await this.rolePermsRepo.delete({
          permission: In([nonExistingIds]),
          role
        });
      }
    }
    const rolePerms = this.adapter.convertDtoToEntity(rolePermDto);
    for (const rolePerm of rolePerms) {
      const existing = await this.rolePermsRepo.findOne({ where: { role: rolePerm.role, permission: rolePerm.permission } });
      if (existing) {
        rolePerm.id = existing.id;
      }
      await this.rolePermsRepo.save(rolePerm);
    }
    return new CommonResponse(true, 1234, 'RolePerms created successfully');

  }

  async getAllRolePerms(): Promise<GetAllRolePermissionsResponse> {
    try {
      const rolePerms = await this.rolePermsRepo.find();
      const data = rolePerms.map((rolePerm) => this.adapter.convertEntityToDto(rolePerm));
      return new CommonResponse(true, 1233, 'Role Perms retrieved successfully', data);
    } catch (error) {
      throw new Error('An error occurred while retrieving the role Perms.');
    }
  }

  async activateOrDeactivateRolePerm(activateDto: any): Promise<CommonResponse> {
    try {
      const rolePerm = await this.rolePermsRepo.findOne({ where: { id: activateDto.id } });
      if (!rolePerm) {
        throw new Error('RolePerm not found.');
      }
      rolePerm.isActive = !rolePerm.isActive;
      await this.rolePermsRepo.save(rolePerm);
      return new CommonResponse(true, 1233, 'Role Perm status changed successfully');
    } catch (error) {
      throw new Error('An error occurred while activating or deactivating the role Perm.');
    }
  }

  async getRolePermissionByRoleId(req: RolesIdReqDto): Promise<GetAllRolePermissionsResponse> {
    const app = new RolesEntity();
    app.id = req.rolesId;
    const getAll = await this.rolePermsRepo.find({ where: { role: app }, relations: ['role', 'permission', 'permission.scope', 'permission.subMenu'] });
    const getData: RolePermissionDto[] = [];
    for (const app of getAll) {
      const data = this.adapter.convertEntityToDto(app)
      getData.push(data)
    }
    if (getData.length === 0) {
      return new GetAllRolePermissionsResponse(false, 45, 'No Data Found');
    }
    return new GetAllRolePermissionsResponse(true, 456, "Data Retrieved Successfully", getData)

  }
}
