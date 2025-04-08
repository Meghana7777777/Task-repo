import { CommonRequestAttrs } from "../ums-common";

export class PermissionsDto extends CommonRequestAttrs {
  permissionId: number;
  name: string;
  subMenuId: number;
  subMenu: string;
  scopeId: number;
  scope: string;
  moduleName: string;
  moduleId: number;
  applicationId: number;
  application: string;
  versionFlag: number;
  isActive: boolean;
  constructor(
    username: string,
    userId: number,
    permissionId: number,
    name: string,
    subMenuId: number,
    subMenu: string,
    scopeId: number,
    scope: string,
    versionFlag: number,
    isActive: boolean,
    moduleId: number,
    moduleName: string,
    applicationId: number,
    application: string
  ) {
    super(username, userId);
    this.isActive = isActive;
    this.name = name;
    this.permissionId = permissionId;
    this.scopeId = scopeId;
    this.scope = scope;
    this.subMenuId = subMenuId;
    this.subMenu = subMenu;
    this.versionFlag = versionFlag;
    this.moduleId = moduleId;
    this.moduleName = moduleName;
    this.applicationId = applicationId;
    this.application = application;
  }
}
