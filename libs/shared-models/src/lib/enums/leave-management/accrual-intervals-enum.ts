export enum AccrualIntervalsEnum{
    YEARLY = "YEARLY",
    HALF_YEARLY = "HALF_YEARLY",
    TRIANNUALLY = "TRIANNUALLY",
    QUARTERLY = "QUARTERLY",
    BI_MONTHLY = "BI_MONTHLY",
    MONTHLY = "MONTHLY",
    SEMI_MONTHLY = "SEMI_MONTHLY",
    BI_WEEKLY = "BI_WEEKLY",
    WEEKLY = "WEEKLY"
}

export const AccrualIntervalsDisplay: Record<AccrualIntervalsEnum,string>={
    [AccrualIntervalsEnum.YEARLY]: "Yearly",
    [AccrualIntervalsEnum.HALF_YEARLY]: "Half-Yearly",
    [AccrualIntervalsEnum.TRIANNUALLY]: "Triannually",
    [AccrualIntervalsEnum.QUARTERLY]: "Quarterly",
    [AccrualIntervalsEnum.BI_MONTHLY]: "Bi-Monthly",
    [AccrualIntervalsEnum.MONTHLY]: "Monthly",
    [AccrualIntervalsEnum.SEMI_MONTHLY]: "Semi-Monthly",
    [AccrualIntervalsEnum.BI_WEEKLY]: "Bi-Weekly",
    [AccrualIntervalsEnum.WEEKLY]: "Weekly"
}