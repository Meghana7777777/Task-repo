 

import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { ApplicationsDto } from './dto/applications.dto';
import { ApplicationsResponse, ApplicationIdReqDto, ApplicationsDropDownResponse, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler

  ) {

  }
  @Post('createApplication')
  async create(@Body() createDto: ApplicationsDto): Promise<CommonResponse> {
    try {
      return await this.applicationsService.create(createDto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }

  };

  @Post('getAllApplications')
  async getAllApplications(): Promise<ApplicationsResponse> {
    try {
      return await this.applicationsService.getAllApplications()
    } catch (error) {
      return this.applicationExceptionHandler.returnException(ApplicationsResponse, error);
    }

  };


  // @Post('getApplicationsById')
  // async getApplicationById(@Body() id: string): Promise<any> {
  //   try {
  //     return await this.applicationsService.getApplicationsById(id)
  //   } catch (error) {
  //     return this.applicationExceptionHandler.returnException(CommonResponse, error);
  //   }
  // }

  @Post('activateOrDeactivate')
  async activateOrDeactivate(@Body() deactivateDto: ApplicationIdReqDto): Promise<CommonResponse> {
    try {
      return await this.applicationsService.activateOrDeactivate(deactivateDto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  };

  @Post('getAllApplicationsDropDown')
  async getAllApplicationsDropDown(): Promise<ApplicationsDropDownResponse> {
    try {
      return await this.applicationsService.getAllApplicationsDropDown()
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }


}
