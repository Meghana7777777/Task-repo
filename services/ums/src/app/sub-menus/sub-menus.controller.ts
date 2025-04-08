import { Body, Controller, Post } from '@nestjs/common';
import { SubMenusService } from './sub-menus.service';
import { ApiTags } from '@nestjs/swagger';
import { SubMenuDto, GetAllSubMenusResponse, AppModuleMenuIdReqDto, SubMenusDropDownResponse, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
@ApiTags('SubMenus')
@Controller('subMenus')
export class SubMenuController {
  constructor(private readonly subMenuService: SubMenusService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }



  @Post('createSubmenu')
  async create(@Body() subMenuDto: SubMenuDto): Promise<CommonResponse> {
    try {
      return await this.subMenuService.createSubMenu(subMenuDto);
    } catch (error) {
    return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('getAllSubMenus')
  async getAllSubMenus(): Promise<GetAllSubMenusResponse> {
    try {
      return await this.subMenuService.getAllSubMenus();
    } catch (error) {
    return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('getAllSubMenusByMenuModuleAndAppId')
  async getAllSubMenusByMenuModuleAndAppId(@Body() req: AppModuleMenuIdReqDto): Promise<GetAllSubMenusResponse> {
    try {
      return await this.subMenuService.getAllSubMenusByMenuModuleAndAppId(req);
    } catch (error) {
    return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('getAllSubMenusDropDown')
  async getAllSubMenuDropDown(): Promise<SubMenusDropDownResponse> {
    try {
      return await this.subMenuService.getAllSubMenusDropDown();
    } catch (error) {
    return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('getAllSubMenusDropDownByMenuModuleAndAppId')
  async getAllSubMenusDropDownByMenuModuleAndAppId(@Body() req: AppModuleMenuIdReqDto): Promise<SubMenusDropDownResponse> {
    try {
      return await this.subMenuService.getAllSubMenusDropDownByMenuModuleAndAppId(req);
    } catch (error) {
    return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }



  @Post('activateOrDeactivateSubMenu')
  async activateOrDeactivateSubMenu(@Body() subMenuDto: SubMenuDto): Promise<CommonResponse> {
    try {
      return await this.subMenuService.activateOrDeactivateSubMenu(subMenuDto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }


}