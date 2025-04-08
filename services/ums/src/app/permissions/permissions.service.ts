import { Injectable } from '@nestjs/common';
import { PermsRepository } from './repo/perm.repo';
import { PermissionAdapter } from './repo/permissions.adapter';
import { ActivatePermDto } from './dto/active-deactive.dto';
import { ApplicationEntity } from '../applications/entities/application.entity';
import { ModulesEntity } from '../modules/entities/modules.entity';
import { SubMenuEntity } from '../sub-menus/entities/sub-menus.entity';
import { PermissionsDto, GetAllPermissionResponse, AppModuleSubMenuIdReqDto, DropdownPermissionResponse, DropdownPermissionsDto } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@Injectable()
export class PermsService {
    constructor(
        private readonly permsRepo: PermsRepository,
        private readonly adapter: PermissionAdapter,
    ) { }

    async createPerm(permDto: PermissionsDto): Promise<CommonResponse> {
        const perm = this.adapter.convertEntityToDto(permDto);
        const save = await this.permsRepo.save(perm);
        return new CommonResponse(true, 1234, 'perms created successfully');
    }

    async getAllPerms(): Promise<GetAllPermissionResponse> {
        const perms = await this.permsRepo.find();
        const data: PermissionsDto[] = [];
        for (const entity of perms) {
            const get = this.adapter.convertDtoToEntity(entity)
            data.push(get)
        }
        return new GetAllPermissionResponse(true, 1233, ' Perms retrieved successfully', data);
    }

    async getAllPermsBySubMenuModuleAndAppId(req: AppModuleSubMenuIdReqDto): Promise<GetAllPermissionResponse> {
        let where = {
            isActive: true
        }
        if (req.appId) {
            const application = new ApplicationEntity();
            application.id = req.appId;
            where['application'] = application;
        }
        if (req.moduleId) {
            const module = new ModulesEntity();
            module.id = req.moduleId;
            where['module'] = module;
        }
        if (req.subMenuId) {
            const subMenu = new SubMenuEntity();
            subMenu.id = req.subMenuId;
            where['subMenu'] = subMenu;
        }
        const perms = await this.permsRepo.find({ where, relations: ['subMenu', 'scope', 'module', 'application'] });
        const data: PermissionsDto[] = [];
        for (const entity of perms) {
            const get = this.adapter.convertDtoToEntity(entity)
            data.push(get)
        }
        return new GetAllPermissionResponse(true, 1233, ' Perms retrieved successfully', data);
    }


    async getAllPermsDropDown(): Promise<DropdownPermissionResponse> {
        const perms = await this.permsRepo.find({ select: ['id', 'name'] });
        const data: DropdownPermissionsDto[] = [];
        for (const res of perms) {
            const bind = this.adapter.convertDropdownEntityToDto(res);
            data.push(bind)
        }
        return new DropdownPermissionResponse(true, 1233, ' Perms retrieved successfully', data);
    }


    async activateOrDeactivatePermission(activateDto: ActivatePermDto): Promise<CommonResponse> {
        const deactivate = await this.permsRepo.findOne({ where: { id: activateDto.id } })
        const activate = await this.permsRepo.update({ id: activateDto.id }, { isActive: !deactivate.isActive })
        return new CommonResponse(true, 1233, `Perm status ${deactivate.isActive ? 'Deactivated' : 'Activated'} successfully`);
    }

} 
