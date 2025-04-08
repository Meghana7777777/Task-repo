import { ApprovalStatusEnum } from '@hrexpert/shared-models';

export class ShiftChangeRequest {
    
    id: number;

    employeeId: number;

    shiftCode: string;

    fromDate: Date;

    toDate: Date;

    fromShift: number;

    toShift: number;

    requestStatus: ApprovalStatusEnum;

    reason: string;

    isActive: boolean;

    rejectionReason?: string; // Optional, as it might not be set initially

    createdUser?: string;

    updatedUser?: string; // Optional for initial creation
}
