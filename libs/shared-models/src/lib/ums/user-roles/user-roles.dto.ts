import { ActionsEnum, CommonRequestAttrs } from "../ums-common";

export class UserRoleDto extends CommonRequestAttrs {
    userRoleId: number;
    rolesId: number;
    roleName: string;
    usersId: number;
    isActive: boolean;
    versionFlag: number;
    actionType: ActionsEnum;
    constructor(
        username: string,
        createdUserId: number,
        userRoleId: number,
        usersId: number,
        rolesId: number,
        roleName: string,
        isActive: boolean,
        versionFlag: number,
        actionType: ActionsEnum
    ) {
        super(username, createdUserId);
        this.userRoleId = userRoleId
        this.usersId = usersId;
        this.rolesId = rolesId;
        this.roleName = roleName;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.actionType = actionType;
    }
}