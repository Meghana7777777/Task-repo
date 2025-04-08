 
import { Injectable } from '@nestjs/common';
import { UserRolesAdapter } from './adapters/userroles.adapter';
import { ActivateUserRolesDto } from './dtos/activate.dto';
import { UserRolesRepository } from './repositories/user-roles.repo';
import { UserRolesDto } from './dtos/userroles.dto';
import { UserEntity } from '../users/entities/users.entity';
import { SubMenuRepository } from '../sub-menus/repo/sub-menu-repo';
import { In } from 'typeorm';
import { UserRoleDto, UsersIdDto, UserRolesResponse } from '@hrexpert/shared-models';
import { CommonResponse, ActionsEnum, UserPermissionsResponse, MenusData, SubMenuData, UserPermissionsDto } from 'libs/shared-models/src/lib/ums/ums-common';
import { UsersService } from '@hrexpert/shared-services';


@Injectable()
export class UserRolesService {
  constructor(
    private userRolesDataRepo: UserRolesRepository,
    private userRolesAdapter: UserRolesAdapter,
    private submenuRepo: SubMenuRepository,
    private userService: UsersService
  ) {

  }


  async mapOrUnMapRolesToUser(createDto: UserRoleDto): Promise<CommonResponse> {
    if (createDto.actionType == ActionsEnum.DELETE)
      return this.deleteUserRoleMapping(createDto)
    const conversion = this.userRolesAdapter.convertDtoToEntity(createDto);
    const saving = await this.userRolesDataRepo.save(conversion)
    return new CommonResponse(true, 1234, 'created successfully', saving)
  };

  async deleteUserRoleMapping(createDto: UserRoleDto) {
    await this.userRolesDataRepo.delete({ id: createDto.userRoleId })
    return new CommonResponse(true, 1234, 'User to Roles are un-mapped successfully')
  }

  async getAllRolesByUserId(req: UsersIdDto): Promise<UserRolesResponse> {
    const user: UserEntity = new UserEntity();
    user.id = req.usersId;
    const getAll = await this.userRolesDataRepo.find({ where: { user }, relations: ['role', 'user'] });
    const getData: UserRoleDto[] = [];
    for (const app of getAll) {
      const data = this.userRolesAdapter.convertEntitytoDto(app);
      getData.push(data);
    }
    return new UserRolesResponse(true, 1234, "Data retrieved succesfully", getData)
  };

  async getAllPermissionsByUserId(req: UsersIdDto): Promise<UserPermissionsResponse> {
    const records = await this.userRolesDataRepo.getAllPermissionsByUserId(req.userId,req.unitId);
   
    const branchPremision = await this.userService.getUsersData({
      userId:req.userId,
    });
    
    const branchChildren = branchPremision?.data?.[0]?.children || [];
    if (records.length == 0) {
      return new UserPermissionsResponse(false, 33333, "Records Not Found");
    }
    const userInfoMap = new Map<string, MenusData>();
    const subMenuMap = new Map<string, Map<string, SubMenuData>>();
    const roleIds = new Set('');
    const roleNames = new Set('');
    const parentSubMenusIds = new Set();
    for (const record of records) {
      const menuId = record.menuId;
      const subMenuId = record.subMenuId;
      const parentSubMenuId = record.baseSubMenuId;
      roleIds.add(record.roleId);
      roleNames.add(record.roleName);
      if (parentSubMenuId)
        parentSubMenusIds.add(parentSubMenuId)
      // to keep menus as a parent 
      if (menuId&&!userInfoMap.has(menuId)) {
        userInfoMap.set(menuId, new MenusData(record.menuName, record.menuId, record.menuName, record.menuIconType, record.menuIconName, [], record.mOrder))
      }
      if (!subMenuMap.has(menuId)) {
        const firstSubMenuMap = new Map();
        firstSubMenuMap.set(subMenuId, new SubMenuData(record.subMenuName, record.subMenuId, record.subMenuName, record.subMenuIconType, record.subMenuIconName, record.path, record.component, [record.scope], record.smOrder, record.baseSubMenuId));
        subMenuMap.set(menuId, firstSubMenuMap);
      } else {
        if (!subMenuMap.get(menuId).has(subMenuId)) {
          subMenuMap.get(menuId).set(subMenuId, new SubMenuData(record.subMenuName, record.subMenuId, record.subMenuName, record.subMenuIconType, record.subMenuIconName, record.path, record.component, [record.scope], record.smOrder, record.baseSubMenuId,[],record.isOnlyRouting));
        } else {
          const scopes = new Set(subMenuMap.get(menuId).get(subMenuId).scopes);
          scopes.add(record.scope);
          subMenuMap.get(menuId).get(subMenuId).scopes = Array.from(scopes);
        }
      }
    }
    const parentSubmenuDataMap = new Map<string, Map<string, SubMenuData>>();
    const baseSubmenuData = await this.submenuRepo.find({ relations: ['menu'], where: { id: In([...Array.from(parentSubMenusIds)]) } })
    for (const record of baseSubmenuData) {
      if (!parentSubmenuDataMap.has(record.menu.id.toString())) {
        const firstSubMenuMap = new Map();
        firstSubMenuMap.set(record.id.toString(), new SubMenuData(record.name, record.id.toString(), record.name, record.iconType, record.iconName, record.path, record.component, [], record.order, record.menu.id.toString(), []));
        parentSubmenuDataMap.set(record.menu.id.toString(), firstSubMenuMap)
      } else {
        if (!parentSubmenuDataMap.get(record.menu.id.toString()).has(record.id.toString())) {
          parentSubmenuDataMap.get(record.menu.id.toString()).set(record.id.toString(), new SubMenuData(record.name, record.id.toString(), record.name, record.iconType, record.iconName, record.path, record.component, [], record.order, record.menu.id.toString(), []));
        }
      }
    }
    for (const [menu, MenuObj] of userInfoMap.entries()) {
      for (const rec of Array.from(subMenuMap.get(menu).values())) {
        if (rec?.baseSubMenuId) {
          parentSubmenuDataMap.get(menu.toString()).get(rec.baseSubMenuId.toString()).subMenuChildren.push(rec)
        } else {
          if (!parentSubmenuDataMap.has(menu.toString())) {
            const firstSubMenuMap = new Map();
            firstSubMenuMap.set(rec.subMenuId.toString(), rec);
            parentSubmenuDataMap.set(menu.toString(), firstSubMenuMap);
          } else {
            if (!parentSubmenuDataMap.get(menu.toString()).has(rec.subMenuId)) {
              parentSubmenuDataMap.get(menu.toString()).set(rec.subMenuId.toString(), rec);
            }
          }
        }
      }
    }
    for (const [menu, MenuObj] of userInfoMap.entries()) {
      userInfoMap.get(menu).subMenuData.push(...Array.from(parentSubmenuDataMap.get(menu.toString()).values()).sort((a, b) => a.orderId - b.orderId));
    }
    const userRolesArray: MenusData[] = [];
    userInfoMap.forEach(menusData => userRolesArray.push(menusData));
    const userData = new UserPermissionsDto(records[0].userId, records[0].userName, Array.from(roleIds), Array.from(roleNames), userRolesArray, records[0].employeeId,records[0].employeeCode, records[0].unitId, records[0].unit,null,branchChildren);
    return new UserPermissionsResponse(true, 53, 'Retrieved SuccessFully', userData);
  }



  async activateOrDeactivate(deactivateDto: ActivateUserRolesDto): Promise<CommonResponse> {
    const deactivate = await this.userRolesDataRepo.findOne({ where: { uuid: deactivateDto.id } })
    const activate = await this.userRolesDataRepo.update({ uuid: deactivateDto.id }, { isActive: !deactivate.isActive })
    return new CommonResponse(true, 1234, `Status ${deactivate.isActive ? 'deactivated' : 'activated'} successfully`);
  };


}
