export class RolePermDto {
  subMenuId: number;
  roleId: number;
  permissionIds: number[];
  /**
   * 
   * @param roleId 
   * @param permissionIds 
   */
  constructor(subMenuId: number,roleId: number, permissionIds: number[]) {
    this.subMenuId = subMenuId;
    this.roleId = roleId;
    this.permissionIds = permissionIds;
  }
}
