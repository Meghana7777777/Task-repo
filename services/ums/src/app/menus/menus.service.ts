import { Injectable } from '@nestjs/common';
import { MenuRepository } from './repo/menu.repo';
import { MenuAdapter } from './dto/adapter';
import { ActivateMenuDto } from './dto/activate.dto';
import { ApplicationEntity } from '../applications/entities/application.entity';
import { ModulesEntity } from '../modules/entities/modules.entity';
import { MenusDto, GetAllMenusResponse, AppModuleIdReqDto, MenusDropDownResponse, MenusDropdownDto } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@Injectable()
export class MenuService {
  constructor(
    private readonly menuRepo: MenuRepository,
    private readonly adapter: MenuAdapter,
  ) { }

  async createMenu(menuDto: MenusDto): Promise<CommonResponse> {
    const conversion = this.adapter.convertDtoToEntity(menuDto);
    const save = await this.menuRepo.save(conversion);
    return new CommonResponse(true, 1234, "created successfully")
  }

  async getAllMenus(): Promise<GetAllMenusResponse> {
    const getAll = await this.menuRepo.find();
    const data: MenusDto[] = [];
    for (const entity of getAll) {
      const conversion = this.adapter.convertEntityToDto(entity);
      data.push(conversion);
    }
    return new GetAllMenusResponse(true, 1233, 'Data Retried Successfully')
  }

  async getAllMenusByModuleAndAppId(req: AppModuleIdReqDto): Promise<GetAllMenusResponse> {
    const app = new ApplicationEntity();
    app.id = req.appId;
    const module = new ModulesEntity();
    module.id = req.moduleId;
    const getAll = await this.menuRepo.find({ where: { application: app, module }, relations: ['application', 'module'] });
    const data: MenusDto[] = [];
    for (const entity of getAll) {
      const conversion = this.adapter.convertEntityToDto(entity);
      data.push(conversion);
    }
    return new GetAllMenusResponse(true, 1233, 'Data Retried Successfully', data)
  }


  async getAllMenusDropDown(): Promise<MenusDropDownResponse> {
    const dropdown = await this.menuRepo.find({ select: ['name', 'id'] });
    const data: MenusDropdownDto[] = [];
    for (const entity of dropdown) {
      const dropdownConversion = this.adapter.convertDropdownEntityToDto(entity);

      data.push(dropdownConversion);
    }
    return new MenusDropDownResponse(true, 1233, 'Data Retrieved Successfully', data)
  }



  async getAllMenusDropDownByModuleAndAppId(req: AppModuleIdReqDto): Promise<MenusDropDownResponse> {
    const app = new ApplicationEntity();
    app.id = req.appId;
    const module = new ModulesEntity();
    module.id = req.moduleId;
    const dropdown = await this.menuRepo.find({ select: ['name', 'id'], where: { application: app, module } });
    const data: MenusDropdownDto[] = [];
    for (const entity of dropdown) {
      const dropdownConversion = this.adapter.convertDropdownEntityToDto(entity);

      data.push(dropdownConversion);
    }
    return new MenusDropDownResponse(true, 1233, 'Data Retrieved Successfully', data)
  }

  async activateAndDeactivatedMenu(activateDto: ActivateMenuDto): Promise<CommonResponse> {
    const deactivate = await this.menuRepo.findOne({ where: { id: activateDto.menuId } });
    const activate = await this.menuRepo.update({ id: activateDto.menuId }, { isActive: !deactivate.isActive })

    return new CommonResponse(true, 1233, `status  ${deactivate.isActive ? 'Deactivated' : 'Activated'} successfully`);
  }
}
