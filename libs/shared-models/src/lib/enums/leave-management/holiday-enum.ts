export enum HolidayType{
    PUBLIC = "PUBLIC HOLIDAY",
    NATIONAL = "NATIONAL HOLIDAY",
    OPTIONAL = "OPTIONAL HOLIDAY",
    WEEK_OFF = 'WEEK OFF',
}

export const HolidayTypeDisplay: Record<HolidayType, string>={
    [HolidayType.PUBLIC]: "PUBLIC HOLIDAY",
    [HolidayType.NATIONAL]: "NATIONAL HOLIDAY",
    [HolidayType.OPTIONAL]: "OPTIONAL HOLIDAY",
    [HolidayType.WEEK_OFF]: "WEEK OFF",
}