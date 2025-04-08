
export class AttendanceStatusDto {
    id?: number;
    attendanceStatus?: string;
    startTime?: string;
    endTime?: string;
    createdUser?: string;
    branchId?: number;
    branchName?: number;
    isActive?: boolean
    versionFlag?: number;
    updatedUser?: string;
    updatedAt?: Date;

    constructor(id?: number, attendanceStatus?: string,
        startDate?: string,
        endDate?: string,
        branchId?: number,
        branchName?: number,
        createdUser?: string, isActive?: boolean, versionFlag?: number, updatedUser?: string,
        updatedAt?: Date) {
        this.id = id;
        this.attendanceStatus = attendanceStatus;
        this.startTime = startDate;
        this.endTime = endDate;
        this.branchId = branchId;
        this.branchName = branchName;
        this.createdUser = createdUser;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.updatedUser = updatedUser;
        this.updatedAt = updatedAt;

    }
}
