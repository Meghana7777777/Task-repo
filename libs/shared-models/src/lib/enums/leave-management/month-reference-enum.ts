export enum MonthReferenceEnum {
    FIRST_MONTH = 'FIRST_MONTH',
    LAST_MONTH = 'LAST_MONTH',
    POLICY_MONTH = 'POLICY_MONTH',
    JOINING_MONTH = 'JOINING_MONTH',
    BIRTH_MONTH = 'BIRTH_MONTH',
  }
  
  export const MonthReferenceDisplay: Record<MonthReferenceEnum, string> = {
    [MonthReferenceEnum.FIRST_MONTH]: '1-12 Months',
    [MonthReferenceEnum.LAST_MONTH]: 'Last Month',
    [MonthReferenceEnum.POLICY_MONTH]: 'Policy Month',
    [MonthReferenceEnum.JOINING_MONTH]: 'Joining Month',
    [MonthReferenceEnum.BIRTH_MONTH]: 'Birth Month',
  };
  