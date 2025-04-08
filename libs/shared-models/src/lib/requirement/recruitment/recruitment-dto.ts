export class RecruitmentReq {
    id?: number;
    company:string
    jobRole: string;
    jobDescription: string;
    notificationDate: Date;
    resourceRequired: number;
    technology: string;
    planningClosingDate: Date;
    billingRate: string;
    approxExperience: string;
    minProjectDuration: string;
    expensesPaidByClient: boolean;
    status: string;
    jobLocation: string;
    remarks?: string;
    createdUser: string;
    isActive?: boolean;
    versionFlag?: number;
    updatedUser?: string;
    updatedAt?: Date;
  
    constructor(
      id?: number,
      company?: string,
      jobRole?: string,
      jobDescription?: string,
      notificationDate?: Date,
      resourceRequired?: number,
      technology?: string,
      planningClosingDate?: Date,
      billingRate?: string,
      approxExperience?: string,
      minProjectDuration?: string,
      expensesPaidByClient?: boolean,
      status?: string,
      jobLocation?: string,
      remarks?: string,
      createdUser?: string,
      isActive?: boolean,
      versionFlag?: number,
      updatedUser?: string,
      updatedAt?: Date
    ) {
      this.id = id;
      this.company =company
      this.jobRole = jobRole;
      this.jobDescription = jobDescription;
      this.notificationDate = notificationDate;
      this.resourceRequired = resourceRequired;
      this.technology = technology;
      this.planningClosingDate = planningClosingDate;
      this.billingRate = billingRate;
      this.approxExperience = approxExperience;
      this.minProjectDuration = minProjectDuration;
      this.expensesPaidByClient = expensesPaidByClient;
      this.status = status;
      this.jobLocation = jobLocation;
      this.remarks = remarks;
      this.createdUser = createdUser;
      this.isActive = isActive;
      this.versionFlag = versionFlag;
      this.updatedUser = updatedUser;
      this.updatedAt = updatedAt;
    }
  }
  