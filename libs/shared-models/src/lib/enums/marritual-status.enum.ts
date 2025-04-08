export enum MaritualStatusEnum {
    M="M" ,
    U ="U",
    O ="O",
}

export const MaritualStatuDisplayLabels: Record<MaritualStatusEnum, string> = {
    [MaritualStatusEnum.M]: "Married",
    [MaritualStatusEnum.U]: "Un Married",
    [MaritualStatusEnum.O]: "Others"
  };