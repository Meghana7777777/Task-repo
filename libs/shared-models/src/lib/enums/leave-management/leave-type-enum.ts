export enum LeaveTypeEnum {
    PAID = 'PAID',
    UNPAID = 'UNPAID',
    ON_DUTY = 'ON_DUTY',
    RESTRICTED_HOLIDAY = 'RESTRICTED_HOLIDAY',
}

export const LeaveTypeDisplay: Record<LeaveTypeEnum, string> = {
    [LeaveTypeEnum.PAID]: "Paid",
    [LeaveTypeEnum.UNPAID]: "Unpaid",
    [LeaveTypeEnum.ON_DUTY]: "On Duty",
    [LeaveTypeEnum.RESTRICTED_HOLIDAY]: "Restricted Holiday",
};

export enum LeavePolicyTypeEnum {
    FIXED_ENTITLEMENT = 'FIXED_ENTITLEMENT',
    EXPERIENCE_BASED_ENTITLEMENT = 'EXPERIENCE_BASED_ENTITLEMENT',
    GRANT_BASED_ENTITLEMENT = 'GRANT_BASED_ENTITLEMENT',
    ATTENDANCE_BASED_ENTITLEMENT = 'ATTENDANCE_BASED_ENTITLEMENT',
}

export const LeavePolicyTypeDisplay: Record<LeavePolicyTypeEnum, string>={
    [LeavePolicyTypeEnum.FIXED_ENTITLEMENT]: 'Fixed Entitlement',
    [LeavePolicyTypeEnum.EXPERIENCE_BASED_ENTITLEMENT]: 'Experience Based Entitlement',
    [LeavePolicyTypeEnum.GRANT_BASED_ENTITLEMENT]: 'Grant Based Entitlement',
    [LeavePolicyTypeEnum.ATTENDANCE_BASED_ENTITLEMENT]: 'Attendance Based Entitlement'
}

export enum CriteriaEnum{
    GENDERS =  "GENDERS",
    MARITAL_STATUS = "MARITAL_STATUS",
    DEPARTMENTS = "DEPARTMENTS",
    DESIGNATIONS = "DESIGNATIONS",
    BRANCHES = "BRANCHES",
    ROLES = "ROLES",
}

export const CriteriaDisplay: Record<CriteriaEnum, string> = {
    [CriteriaEnum.GENDERS]: 'Genders',
    [CriteriaEnum.MARITAL_STATUS]: 'Marital Status',
    [CriteriaEnum.DEPARTMENTS]: 'Departments',
    [CriteriaEnum.DESIGNATIONS]: 'Designations',
    [CriteriaEnum.BRANCHES]: 'Branches',
    [CriteriaEnum.ROLES]: 'Roles',
}

export enum UOMEnum{
    DAYS = 'DAYS',
    HOURS = 'HOURS'
}

export enum TypeOfEntityEnum{
    LEAVE_TYPE = 'LEAVE_TYPE',
    LEAVE_GROUP = 'LEAVE_GROUP'
}

export const TypeOfEntityDisplay: Record<TypeOfEntityEnum, string>={
    [TypeOfEntityEnum.LEAVE_TYPE]: 'Leave Type',
    [TypeOfEntityEnum.LEAVE_GROUP]: 'Leave Group'
}

export enum EffectiveFromEnum{
    DATE_OF_JOINING = 'DATE_OF_JOINING',
    DATE_OF_CONFIRMATION = 'DATE_OF_CONFIRMATION'
}

export const EffectiveFromDisplay: Record<EffectiveFromEnum, string>={
    [EffectiveFromEnum.DATE_OF_JOINING]: 'Date of Joining',
    [EffectiveFromEnum.DATE_OF_CONFIRMATION]: 'Date of Confirmation'
}

export enum EffectiveFromUomEnum{
    YEARS = 'YEARS',
    MONTHS = 'MONTHS',
    DAYS = 'DAYS'
}

export enum AccrualPeriodEnum{
    ONE_TIME = 'ONE_TIME',
    YEARLY = 'YEARLY',
    MONTHLY = 'MONTHLY',
    HALF_YEARLY = 'HALF_YEARLY',
    TRIANNUALLY = 'TRIANNUALLY',
    QUARTERLY = 'QUARTERLY',
    // BI_MONTHLY = 'BI_MONTHLY',
    // SEMI_MONTHLY = 'SEMI_MONTHLY',
    // BI_WEEKLY = 'BI_WEEKLY',
    // WEEKLY = 'WEEKLY'
}

export const AccrualPeriodDisplay: Record<AccrualPeriodEnum, string>={
    [AccrualPeriodEnum.ONE_TIME]: 'One Time',
    [AccrualPeriodEnum.YEARLY]: 'Yearly',
    [AccrualPeriodEnum.MONTHLY]: 'Monthly',
    [AccrualPeriodEnum.HALF_YEARLY]: 'Half Yearly',
    [AccrualPeriodEnum.TRIANNUALLY]: 'Triannually',
    [AccrualPeriodEnum.QUARTERLY]: 'Quarterly',
    // [AccrualPeriodEnum.BI_MONTHLY]: 'Bi-Monthly',
    // [AccrualPeriodEnum.SEMI_MONTHLY]: 'Semi-Monthly',
    // [AccrualPeriodEnum.BI_WEEKLY]: 'Bi-Weekly',
    // [AccrualPeriodEnum.WEEKLY]: 'Weekly'
}

export enum AccrualOnEnum{
    JANUARY = 'JANUARY',
    FEBRUARY = 'FEBRUARY',
    MARCH = 'MARCH',
    APRIL = 'APRIL',
    MAY = 'MAY',
    JUNE = 'JUNE',
    JULY = 'JULY',
    AUGUST = 'AUGUST',
    SEPTEMBER = 'SEPTEMBER',
    OCTOBER = 'OCTOBER',
    NOVEMBER = 'NOVEMBER',
    DECEMBER = 'DECEMBER',
    POLICY_MONTH = 'POLICY_MONTH',
    JOINING_MONTH = 'JOINING_MONTH',
    BIRTH_MONTH = 'BIRTH_MONTH'
}

export const AccrualOnDisplay: Record<AccrualOnEnum, string>={
    [AccrualOnEnum.JANUARY]: 'January',
    [AccrualOnEnum.FEBRUARY]: 'February',
    [AccrualOnEnum.MARCH]: 'March',
    [AccrualOnEnum.APRIL]: 'April',
    [AccrualOnEnum.MAY]: 'May',
    [AccrualOnEnum.JUNE]: 'June',
    [AccrualOnEnum.JULY]: 'July',
    [AccrualOnEnum.AUGUST]: 'August',
    [AccrualOnEnum.SEPTEMBER]: 'September',
    [AccrualOnEnum.OCTOBER]: 'OCtober',
    [AccrualOnEnum.NOVEMBER]: 'November',
    [AccrualOnEnum.DECEMBER]: 'December',
    [AccrualOnEnum.POLICY_MONTH]: 'Policy Month',
    [AccrualOnEnum.JOINING_MONTH]: 'Joining Month',
    [AccrualOnEnum.BIRTH_MONTH]: 'Birth Month'
}

export enum CreditTypeEnum{
    JOINING_MONTH = 'JOINING_MONTH',
    NEXT_MONTH = 'NEXT_MONTH'
}

export const CreditTypeDisplay: Record<CreditTypeEnum,string>={
    [CreditTypeEnum.JOINING_MONTH]: 'Joining Month',
    [CreditTypeEnum.NEXT_MONTH]: 'Next Month'
}