
import { Injectable } from '@nestjs/common';
import { SubMenuRepository } from './repo/sub-menu-repo';
import { SubMenuAdapter } from './sub-menu-adapter';
import { ApplicationEntity } from '../applications/entities/application.entity';
import { ModulesEntity } from '../modules/entities/modules.entity';
import { MenusEntity } from '../menus/entities/menus.entity';
import { SubMenuDto, GetAllSubMenusResponse, AppModuleMenuIdReqDto, SubMenusDropDownResponse, SubMenuDropDownDto } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@Injectable()
export class SubMenusService {
  constructor(
    private readonly subMenuRepo: SubMenuRepository,
    private readonly adapter: SubMenuAdapter,
  ) { }

  async createSubMenu(subMenuDto: SubMenuDto): Promise<CommonResponse> {
    const conversion = this.adapter.convertDtoToEntity(subMenuDto)
    const save = await this.subMenuRepo.save(conversion);
    return new CommonResponse(true, 1234, "created successfully")
  }

  async getAllSubMenus(): Promise<GetAllSubMenusResponse> {
    const getAll = await this.subMenuRepo.find();
    const data: SubMenuDto[] = [];
    for (const entity of getAll) {
      const conversion = this.adapter.convertEntityToDto(entity);
      data.push(conversion);
    }
    return new GetAllSubMenusResponse(true, 1233, 'Data Retried Successfully', data)
  }

  async getAllSubMenusByMenuModuleAndAppId(req: AppModuleMenuIdReqDto): Promise<GetAllSubMenusResponse> {
    const app = new ApplicationEntity();
    app.id = req.appId;
    const module = new ModulesEntity();
    module.id = req.moduleId;
    const menu = new MenusEntity();
    menu.id = req.menuId;
    const getAll = await this.subMenuRepo.find({ where: { application: app, module, menu }, relations: ['application', 'module', 'menu', 'parent'] });
    const data: SubMenuDto[] = [];
    for (const entity of getAll) {
      const conversion = this.adapter.convertEntityToDto(entity);
      data.push(conversion);
    }
    return new GetAllSubMenusResponse(true, 1233, 'Data Retried Successfully', data)
  }

  async getAllSubMenusDropDown(): Promise<SubMenusDropDownResponse> {
    const dropdown = await this.subMenuRepo.find({ select: ['name', 'uuid'] });
    const data: SubMenuDropDownDto[] = [];
    for (const entity of dropdown) {
      const dropdownConversion = this.adapter.convertDropDownEntityToDto(entity);
      data.push(dropdownConversion);
    }
    return new SubMenusDropDownResponse(true, 1233, 'Data Retrieved Successfully', data)
  }

  async getAllSubMenusDropDownByMenuModuleAndAppId(req: AppModuleMenuIdReqDto): Promise<SubMenusDropDownResponse> {
    const application = new ApplicationEntity();
    application.id = req.appId;
    const module = new ModulesEntity();
    module.id = req.moduleId;
    const menu = new MenusEntity();
    menu.id = req.menuId;
    const dropdown = await this.subMenuRepo.find({ select: ['name', 'id'], where: { application, module, menu }, relations: ['application', 'module', 'menu', 'parent'] });
    const data: SubMenuDropDownDto[] = [];
    for (const entity of dropdown) {
      const dropdownConversion = this.adapter.convertDropDownEntityToDto(entity);
      data.push(dropdownConversion);
    }
    return new SubMenusDropDownResponse(true, 1233, 'Data Retrieved Successfully', data)
  }

  async activateOrDeactivateSubMenu(activateDto: SubMenuDto): Promise<CommonResponse> {
    const deactivate = await this.subMenuRepo.findOne({ where: { id: activateDto.menuId } });
    const activate = await this.subMenuRepo.update({ id: activateDto.menuId }, { isActive: !deactivate.isActive })
    return new CommonResponse(true, 1233, 'status changed successfully', activate);
  }
}