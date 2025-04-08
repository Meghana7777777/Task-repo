import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivateUserRolesDto } from './dtos/activate.dto';
import { ClientAppsService } from './client-apps.service';
import { ClientAppsDto, ApplicationIdReqDto, ClientAppsResponse, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@ApiTags('Client Apps')
@Controller('client-apps')
export class ClientAppsController {
  constructor(
    private readonly clientAppsService: ClientAppsService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) {

  }
  @Post('mapOrUnMapAppsToClient')
  async mapOrUnMapAppsToClient(@Body() createDto: ClientAppsDto): Promise<CommonResponse> {
    try {
      return await this.clientAppsService.mapOrUnMapAppsToClient(createDto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  };

  @Post('getAllAppsByApplicationId')
  async getAllAppsByApplicationId(@Body() req: ApplicationIdReqDto): Promise<ClientAppsResponse> {
    try {
      return await this.clientAppsService.getAllAppsByApplicationId(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(ClientAppsResponse, error);
    }
  };


  @Post('activateOrDeactivate')
  async activateOrDeactivate(@Body() deactivateDto: ActivateUserRolesDto): Promise<CommonResponse> {
    try {
      return await this.clientAppsService.activateOrDeactivate(deactivateDto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  };

}
