import { Body, Controller, Post } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ApiTags } from '@nestjs/swagger';
import { ModuleDto } from './dto/module.dto';
import { ModuleIdReqDto } from './dto/module-id-req-dto';
import { GetAllModulesResponse, ApplicationIdReqDto, GetAllModulesDropDownResponse, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@ApiTags('Modules')
@Controller('modules')
export class ModulesController {
  constructor(
    private readonly moduleService: ModulesService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) {

  }
  @Post('createModules')
  async create(@Body() createDto: ModuleDto): Promise<CommonResponse> {
    try {
      return await this.moduleService.create(createDto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }

  };

  @Post('getAllModules')
  async getAllApplications(): Promise<GetAllModulesResponse> {
    try {
      return await this.moduleService.getAllModules()
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllModulesResponse, error);
    }
  };

  @Post('getAllModulesByAppId')
  async getAllModulesByAppId(@Body() req: ApplicationIdReqDto): Promise<GetAllModulesResponse> {
    try {
      return await this.moduleService.getAllModulesByAppId(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllModulesResponse, error);
    }
  };

  @Post('activateOrDeactivate')
  async activateOrDeactivate(@Body() deactivateDto: ModuleIdReqDto): Promise<CommonResponse> {
    try {
      return await this.moduleService.activateOrDeactivate(deactivateDto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  };

  @Post('getAllModulesDropDown')
  async getAllModulesDropDown(): Promise<GetAllModulesDropDownResponse> {
    try {
      return await this.moduleService.getAllModulesDropDown()
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllModulesDropDownResponse, error);
    }
  }


  @Post('getAllModulesDropDownByAppId')
  async getAllModulesDropDownByAppId(@Body() req: ApplicationIdReqDto): Promise<GetAllModulesDropDownResponse> {
    try {
      return await this.moduleService.getAllModulesDropDownByAppId(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllModulesDropDownResponse, error);
    }
  }


}
