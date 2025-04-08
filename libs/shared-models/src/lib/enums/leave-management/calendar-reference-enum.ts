export enum CalendarReferenceEnum {
    FIRST_DAY = 'FIRST_DAY',
    LAST_DAY = 'LAST_DAY',
    POLICY_DATE = 'POLICY_DATE',
    JOINING_DATE = 'JOINING_DATE',
    BIRTH_DATE = 'BIRTH_DATE',
  }
  
  export const CalendarReferenceDisplay: Record<CalendarReferenceEnum, string> = {
    [CalendarReferenceEnum.FIRST_DAY]: '1-31 Days',
    [CalendarReferenceEnum.LAST_DAY]: 'Last Day',
    [CalendarReferenceEnum.POLICY_DATE]: 'Policy Date',
    [CalendarReferenceEnum.JOINING_DATE]: 'Joining Date',
    [CalendarReferenceEnum.BIRTH_DATE]: 'Birth Date',
  };
  