import { Body, Controller, Post } from '@nestjs/common';
import { RolePermDto } from './dto/role_permissions.dto';
import { RolePermissionsService } from './role-permissions.service';
import { ApiTags } from '@nestjs/swagger';
import { GetAllRolePermissionsResponse, RolesIdReqDto, GetAllRolePermissionsDropDownResponse, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
@ApiTags('Role Permissions')
@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermsService: RolePermissionsService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('mapOrUnMapRolePermissions')
  async mapOrUnMapRolePermissions(@Body() rolePermDto: RolePermDto): Promise<CommonResponse> {
    try {
      return await this.rolePermsService.createRolePerm(rolePermDto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('getAllRolePerms')
  async getAllRolePerms(): Promise<GetAllRolePermissionsResponse> {
    try {
      return await this.rolePermsService.getAllRolePerms();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }


  @Post('activateOrDeactivateRolePerms')
  async activateOrDeactivateRolePerm(@Body() activateDto: any): Promise<CommonResponse> {
    try {
      return await this.rolePermsService.activateOrDeactivateRolePerm(activateDto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('getRolePermissionByRoleId')
  async getRolePermissionByRoleId(@Body() req: RolesIdReqDto): Promise<GetAllRolePermissionsDropDownResponse> {
    try {
      return await this.rolePermsService.getRolePermissionByRoleId(req);
    } catch(error) {
      return this.applicationExceptionHandler.returnException(GetAllRolePermissionsDropDownResponse, error)
    }
  }


}
