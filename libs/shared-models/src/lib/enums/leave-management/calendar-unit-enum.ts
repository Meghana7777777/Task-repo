export enum CalendarUnitEnum{
    DAYS = 'DAYS',
    MONTHS = 'MONTHS',
    YEARS = 'YEARS'
}

export const CalendarUnitDisplay: Record<CalendarUnitEnum, string> ={
    [CalendarUnitEnum.DAYS]: "Day(s)",
    [CalendarUnitEnum.MONTHS]: "Month(s)",
    [CalendarUnitEnum.YEARS]: "Year(s)"
}