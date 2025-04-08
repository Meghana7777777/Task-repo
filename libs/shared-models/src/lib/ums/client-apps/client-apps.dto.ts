import { CommonRequestAttrs, ActionsEnum } from "../ums-common";


export class ClientAppsDto extends CommonRequestAttrs {
    clientAppsId: number;
    clientId: number;
    clientName: string;
    appsId: number;
    unitId:number;
    appsName: string;
    isActive: boolean;
    versionFlag: number;
    actionType: ActionsEnum;
    constructor(
        username: string,
        userId: number,
        clientAppsId: number,
        appsId: number,
        unitId: number,
        appsName: string,
        clientId: number,
        clientName: string,
        isActive: boolean,
        versionFlag: number,
        actionType: ActionsEnum
    ) {
        super(username, userId);
        this.clientAppsId = clientAppsId;
        this.appsId = appsId;
        this.appsName = appsName;
        this.clientId = clientId;
        this.unitId = unitId;
        this.clientName = clientName;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.actionType = actionType;
    }
}