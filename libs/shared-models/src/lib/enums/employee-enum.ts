//SalutionEnum
export enum SalutationEnum {
    Mr = 'Mr',
    Mrs = 'Mrs',
    Miss = 'Miss',
    Other = 'Other',
  }

// GenderEnum
export enum GenderEnum {
  M = "M",
  F = "F",
  Other = "Other"
}

export const GenderDisplayLabels: Record<GenderEnum, string> = {
  [GenderEnum.M]: "Male",
  [GenderEnum.F]: "Female",
  [GenderEnum.Other]: "Others"
};


export enum ShiftGroupEnum {
  SG1 = 'SG1',
  SG2 = 'SG2',
  SG3 = 'SG3',
  SG4 = 'SG4',
  SG5 = 'SG5',
}


export enum PerformanceType {
  Appreciation = 'Appreciation',
  Best_Practice = 'Best Practice',
  Issue = 'Issue',
  Memo = 'Memo',
  Suggestion = 'Suggestion',
  Outages = 'Outages',
}

export enum PerformanceFeedbackOn {
  Account = 'Account',
  Accociate = 'Best Practice',
  Project = 'Project'
}
