import { Body, Controller, Post } from '@nestjs/common';
import { PermsService } from './permissions.service';
import { ActivatePermDto } from './dto/active-deactive.dto';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsDto, GetAllPermissionResponse, AppModuleSubMenuIdReqDto, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
@ApiTags('Permissions')
@Controller('permissions')
export class PermsController {
  constructor(private readonly permsService: PermsService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('createPerm')
  async createPerm(@Body() permDto: PermissionsDto): Promise<CommonResponse> {
    try {
      return await this.permsService.createPerm(permDto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('getAllPerms')
  async getAllPerms(): Promise<GetAllPermissionResponse> {
    try {
      return await this.permsService.getAllPerms();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllPermissionResponse, error);
    }
  }

  @Post('getAllPermsBySubMenuModuleAndAppId')
  async getAllPermsBySubMenuModuleAndAppId(@Body() req: AppModuleSubMenuIdReqDto): Promise<GetAllPermissionResponse> {
    try {
      return await this.permsService.getAllPermsBySubMenuModuleAndAppId(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllPermissionResponse, error);
    }
  }

  @Post('activateOrDeactivatePermission')
  async activateOrDeactivatePermission(@Body() activateDto: ActivatePermDto): Promise<CommonResponse> {
    try {
      return await this.permsService.activateOrDeactivatePermission(activateDto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }


}
