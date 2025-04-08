export class EmployeeRMRequest {
    id: number[];
    reportingManager: number;
    constructor(
        id: number[],
        reportingManager: number,
    ) {
        this.id = id
        this.reportingManager = reportingManager
    }
}

export class EmployeeBulkRequest {
    id: any[];
    isActive: boolean;
    constructor(
        id: any[],
        isActive: boolean,
    ) {
        this.id = id
        this.isActive = isActive
    }
}