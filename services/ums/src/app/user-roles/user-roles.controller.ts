
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivateUserRolesDto } from './dtos/activate.dto';
import { UserRolesService } from './user-roles.service';
import { UserRoleDto, UsersIdDto, UserRolesResponse, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse, UserPermissionsResponse } from 'libs/shared-models/src/lib/ums/ums-common';


@ApiTags('User Roles')
@Controller('user-roles')
export class UserRolesController {
  constructor(
    private readonly userRolesService: UserRolesService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) {

  }
  @Post('mapOrUnMapRolesToUser')
  async mapOrUnMapRolesToUser(@Body() createDto: UserRoleDto): Promise<CommonResponse> {
    try {
      return await this.userRolesService.mapOrUnMapRolesToUser(createDto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  };

  @Post('getAllRolesByUserId')
  async getAllRolesByUserId(@Body() req: UsersIdDto): Promise<UserRolesResponse> {
    try {
      return await this.userRolesService.getAllRolesByUserId(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(UserRolesResponse, error);
    }
  };


  @Post('getAllPermissionsByUserId')
  async getAllPermissionsByUserId(@Body() req: UsersIdDto): Promise<UserPermissionsResponse> {
    try {
      console.log(req)
      return await this.userRolesService.getAllPermissionsByUserId(req);
    } catch (error) {
      console.log(error)
      return this.applicationExceptionHandler.returnException(UserPermissionsResponse, error);
    }
  }


  @Post('activateOrDeactivate')
  async activateOrDeactivate(@Body() deactivateDto: ActivateUserRolesDto): Promise<CommonResponse> {
    try {
      return await this.userRolesService.activateOrDeactivate(deactivateDto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  };

}
