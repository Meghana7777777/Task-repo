export class EmpRecComponentsSharedDto {
  id?: number;
  amount?: number;
  employeeId?: number;
  componentId?: number;
  isActive?: boolean;
  createdUser?: string;
  updatedUser?: string;
  versionFlag?: number;
  emiCount?: number;
  emiAmount?: number;
  startDate?: string;
  endDate?: string;
  totalTerms?: number;
  termCount?: string;
  isDerived?: number;
  terms?: {
    termAmount: number;
    totalTerms: number;
    termCount: number;
    payMonth: string;
  }[];

  constructor(
    id?: number,
    amount?: number,
    employeeId?: number,
    componentId?: number,
    isActive?: boolean,
    createdUser?: string,
    updatedUser?: string,
    versionFlag?: number,
    emiCount?: number,
    emiAmount?: number,
    startDate?: string,
    endDate?: string,
    totalTerms?: number,
    termCount?: string,
    isDerived?: number,
    terms?: {
      termAmount: number;
      totalTerms: number;
      termCount: number;
      payMonth: string;
    }[]
  ) {
    this.id = id;
    this.amount = amount;
    this.employeeId = employeeId;
    this.componentId = componentId;
    this.isActive = isActive;
    this.createdUser = createdUser;
    this.updatedUser = updatedUser;
    this.versionFlag = versionFlag;
    this.emiCount = emiCount;
    this.emiAmount = emiAmount;
    this.startDate = startDate;
    this.endDate = endDate;
    this.totalTerms = totalTerms;
    this.termCount = termCount;
    this.isDerived = isDerived;
    this.terms = terms;
  }
}


export const EmpRecCompColumns = [
  "employee_id",
  "component_id",
  "amount"
]

