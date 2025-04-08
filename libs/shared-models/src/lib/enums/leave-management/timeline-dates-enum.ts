export enum TimelineDatesEnum{
    DATE_OF_JOINING = 'DATE_OF_JOINING',
    DATE_OF_CONFIRMATION = 'DATE_OF_CONFIRMATION'
}

export const TimelineDatesDisplay: Record<TimelineDatesEnum, string>={
    [TimelineDatesEnum.DATE_OF_JOINING]: "Date of Joining",
    [TimelineDatesEnum.DATE_OF_CONFIRMATION]: "Date of Confirmation"
}