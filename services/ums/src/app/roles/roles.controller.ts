import { Body, Controller, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesDto } from './dtos/roles.dto';
import { RolesIdReqDto } from './dtos/activate.dto';
import { ApiTags } from '@nestjs/swagger';

import { GetAllRolesResponse, GetAllRolesDropDownResponse, UnitIdDto, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) {

    }
    @Post('createRoles')
    async createRoles(@Body() createDto: RolesDto): Promise<CommonResponse> {
      try {
        return await this.rolesService.createRoles(createDto)
      } catch (error) {
        return this.applicationExceptionHandler.returnException(CommonResponse, error);
      }
  
    };
 
    @Post('getAllRoles')
    async getAllRoles(): Promise<GetAllRolesResponse> {
      try {
        return await this.rolesService.getAllRoles()
      } catch (error) {
        return this.applicationExceptionHandler.returnException(GetAllRolesResponse, error);
      }
  
    };
  // @Post('getRolesById')
  // async getApplicationById(id:string):Promise<any>{
  //   try{
  //     return await this.rolesService.getRolesById(id)
  //   }catch(error){
  //     //return this.rolesExceptionHreturn this.applicationExceptionHandler.returnException(error);
  //   }
    
  // }
  @Post('activateOrDeactivate')
  async activateOrDeactivate(@Body() deactivateDto: RolesIdReqDto): Promise<CommonResponse> {
    try {
      return await this.rolesService.activateOrDeactivate(deactivateDto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  };

  @Post('getRolesDropDown')
  async getAllRolesDropDown(): Promise<GetAllRolesDropDownResponse> {
    try {
      return await this.rolesService.getAllRolesDropDown()
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllRolesDropDownResponse, error);
    }
  }

  @Post('getAllRolesDropDownByUnitId')
  async getAllRolesDropDownByUnitId(): Promise<GetAllRolesDropDownResponse> {
    try {
      return await this.rolesService.getAllRolesDropDownByUnitId()
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllRolesDropDownResponse, error);
    }
  }



  @Post('getAllRolesByUnitId')
  async getAllRolesByUnitId(@Body() req: UnitIdDto): Promise<GetAllRolesResponse> {
    try {
      return await this.rolesService.getAllRolesByUnitId(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllRolesResponse, error);
    }
  }
}
