
import { Body, Controller, Post } from '@nestjs/common';
import { ScopeDto } from './dto/scopes.dto';
import { ScopeService } from './scopes-service';
import { ScopesIdDto } from './dto/scope-id.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetAllScopesResponse, GetAllScopesDropDownResponse, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
@ApiTags('Scopes')
@Controller('scopes')
export class ScopeController {
  constructor(private readonly scopeService: ScopeService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('createScope')
  async createScope(@Body() scopeDto: ScopeDto): Promise<CommonResponse> {
    try {
      return await this.scopeService.createScope(scopeDto);

    } catch (error) {
      throw ( error);
    }
  }

  @Post('getAllScopes')
  async getAllScopes(): Promise<GetAllScopesResponse> {
    try {
      return await this.scopeService.getAllScopes();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllScopesResponse, error);
    }
  }

  @Post('getAllScopesDropDown')
  async getAllScopesDropDown(): Promise<GetAllScopesDropDownResponse> {
    try {
      return await this.scopeService.getAllScopesDropDown();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllScopesDropDownResponse, error);
    }
  }

  @Post('activateAndDeactivatedScope')
  async activateAndDeactivatedScope(@Body() activateDto: ScopesIdDto): Promise<CommonResponse> {
    try {
      return await this.scopeService.activateAndDeactivatedScope(activateDto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }


}
