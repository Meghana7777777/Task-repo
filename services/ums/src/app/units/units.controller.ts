import { Body, Controller, Post } from '@nestjs/common';
import { UnitsService } from './units.service'; 
import { UnitDto } from './dto/units.dto';
import { UnitIdDto } from './dto/unit-id-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationIdReqDto } from '../organization/dtos/activate.dto';
import { GetAllUnitsResponse, OrganizationReqDto, GetAllUnitsDropDownResponse, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
@ApiTags('Units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('createUnit')
  async createUnit(@Body() unitDto: UnitDto): Promise<CommonResponse> {
    try {
      return await this.unitsService.createUnit(unitDto);

    } catch (error) {
      throw ( error);
    }
  }

  @Post('getAllUnits')
  async getAllUnits(): Promise<GetAllUnitsResponse> {
    try {
      return await this.unitsService.getAllUnits();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('getAllUnitsDropDown')
  async getAllUnitsDropDown(@Body() req: OrganizationReqDto): Promise<GetAllUnitsDropDownResponse> {
    try {
      return await this.unitsService.getAllUnitsDropDown(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('activateOrDeactivateUnits')
  async ActivateDeactivateUnitDto(@Body() activateDto: UnitIdDto): Promise<CommonResponse> {
    try {
      return await this.unitsService.ActivateDeactivateUnitDto(activateDto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('getUnitsByOrgId')
  async getUnitsByOrgId(@Body() req: OrganizationIdReqDto): Promise<GetAllUnitsResponse> {
    try {
      return await this.unitsService.getUnitsByOrgId(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
}