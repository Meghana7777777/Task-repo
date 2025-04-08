import { HolidayType } from "../../enums";

export class HolidayDto {
    id: number;
    holidayName: any;
    holidayDate: string;
    type:HolidayType;
    createdUser?: string;
    isActive?: boolean
    versionFlag?: number;
    updatedUser?: string;
    updatedAt?: Date;

    constructor(id: number, holidayName: string, holidayDate: any,type:HolidayType,
        createdUser?: string, isActive?: boolean, versionFlag?: number, updatedUser?: string,
        updatedAt?: Date) {
        this.id = id;
        this.holidayName = holidayName;
        this.holidayDate = holidayDate;
        this.type = type;
        this.createdUser = createdUser;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.updatedUser = updatedUser;
        this.updatedAt = updatedAt;

    }
}
