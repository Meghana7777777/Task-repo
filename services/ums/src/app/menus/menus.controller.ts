import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivateMenuDto } from './dto/activate.dto';
import { MenuService } from './menus.service';
import { MenusDto, GetAllMenusResponse, AppModuleIdReqDto, MenusDropDownResponse, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menuService: MenuService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('createMenu')
  async createMenu(@Body() menuDto: MenusDto): Promise<CommonResponse> {
    try {
      return await this.menuService.createMenu(menuDto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('getAllMenus')
  async getAllMenus(): Promise<GetAllMenusResponse> {
    try {
      return await this.menuService.getAllMenus();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllMenusResponse, error);
    }
  }

  @Post('getAllMenusByModuleAndAppId')
  async getAllMenusByModuleAndAppId(@Body() req: AppModuleIdReqDto): Promise<GetAllMenusResponse> {
    try {
      return await this.menuService.getAllMenusByModuleAndAppId(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllMenusResponse, error);
    }
  }

  @Post('getAllMenusDropDown')
  async getAllMenusDropDown(): Promise<MenusDropDownResponse> {
    try {
      return await this.menuService.getAllMenusDropDown();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(MenusDropDownResponse, error);
    }
  }

  @Post('getAllMenusDropDownByModuleAndAppId')
  async getAllMenusDropDownByModuleAndAppId(@Body() req: AppModuleIdReqDto): Promise<MenusDropDownResponse> {
    try {
      return await this.menuService.getAllMenusDropDownByModuleAndAppId(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(MenusDropDownResponse, error);
    }
  }

  @Post('activateOrDeactivateMenu')
  async activateOrDeactivateMenu(@Body() activateDto: ActivateMenuDto): Promise<CommonResponse> {
    try {
      return await this.menuService.activateAndDeactivatedMenu(activateDto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }


}
