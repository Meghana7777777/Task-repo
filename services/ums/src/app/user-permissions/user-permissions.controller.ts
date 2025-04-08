
import { Body, Controller, Post } from '@nestjs/common';
import { UserPermDto } from './dto/user-permission.dto';
import { UserPermissionsService } from './user-permissions.service';
import { ApiTags } from '@nestjs/swagger';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
@ApiTags('User Permissions')
@Controller('user-permissions')
export class UserPermissionsController {
  constructor(private readonly userPermsService: UserPermissionsService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('createUserPerm')
  async createUserPerm(@Body() userPermDto: UserPermDto): Promise<CommonResponse> {
    try {
      return await this.userPermsService.createUserPerm(userPermDto);

    } catch (error) {
      throw ( error);
    }
  }

  @Post('getAllUserPerms')
  async getAllUserPerms(): Promise<CommonResponse> {
    try {
      return await this.userPermsService.getAllUserPerms();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('getAllUserPermsDropDown')
  async getAllUserPermsDropDown(): Promise<CommonResponse> {
    try {
      return await this.userPermsService.getAllUserPermsDropDown();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('activateOrDeactivateUserPerms')
  async activateOrDeactivateUserPerm(activateDto: any): Promise<CommonResponse> {
    try {
      return await this.userPermsService.activateOrDeactivateUserPerm(activateDto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }


}
