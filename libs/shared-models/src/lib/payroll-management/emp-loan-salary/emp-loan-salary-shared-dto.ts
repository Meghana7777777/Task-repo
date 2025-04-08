import { stat } from "fs";
import { LoanSalaryStatusEnum, LoanSalaryTypeEnum } from "../../enums/payroll-management-enums/loan-salary-application";


export class EmpLoanSalarySharedDto {

    id: number;
    employeeCode: string; 
    firstName: string; 
    designationName: string; 
    dateOfJoining: any; 
    type: LoanSalaryTypeEnum; 
    advanceAmount: number; 
    installments: number;
    effectiveFrom: any; 
    purpose: string; 
    reason: string;
    amountOutstanding: number; 
    dateOfApplying: any; 
    status: LoanSalaryStatusEnum;
    hodMail: string;
    isActive: boolean;
    createdUser: string;
    updatedUser: string;
    versionFlag: number;
    employeeId: number;
  
    constructor(
      id: number,
      employeeCode: string, 
      firstName: string, 
      designationName: string, 
      dateOfJoining: any, 
      type: LoanSalaryTypeEnum, 
      advanceAmount: number, 
      installments: number,
      effectiveFrom: any, 
      purpose: string, 
      reason: string,
      amountOutstanding: number, 
      dateOfApplying: any, 
      status: LoanSalaryStatusEnum,
      hodMail: string,
      isActive: boolean,
      createdUser: string,
      updatedUser: string,
      versionFlag: number,
      employeeId: number,
    ) {
      this.id = id;
      this.employeeCode = employeeCode;
      this.firstName = firstName;
      this.designationName = designationName;
      this.dateOfJoining = dateOfJoining;
      this.type = type;
      this.advanceAmount = advanceAmount;
      this.installments = installments;
      this.effectiveFrom = effectiveFrom;
      this.purpose = purpose;
      this.reason = reason ;
      this.amountOutstanding = amountOutstanding;
      this.dateOfApplying = dateOfApplying;
      this.status = status;
      this.hodMail = hodMail;
      this.isActive = isActive;
      this.createdUser = createdUser;
      this.updatedUser = updatedUser;
      this.versionFlag = versionFlag;
      this.employeeId = employeeId
    }
  
  }  