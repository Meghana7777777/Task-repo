export enum EmployeeStatus {
    OnRollEmployee = 'OnRollEmployee',          // Initial stage, awaiting approval
    LessAgeLimit = 'LessAgeLimit',            // Actively working
    Rejected= 'Rejected',          // Not currently working (e.g., leave, terminated)
    REJOINING = 'Rejoining',        // Rejoining the organization
    RETIRED = 'Retired',            // Employee retired
    RESIGNED = 'Resigned',          // Employee voluntarily left
    TERMINATED = 'Terminated',      // Employment was ended by the organization
    FNFCompleted = 'FNFCompleted'
}