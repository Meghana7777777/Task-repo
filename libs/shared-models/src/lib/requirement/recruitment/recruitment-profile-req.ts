import { CandidateType, SourceType } from "../../enums";

  export class CandidateProfileReq { 
    id?: number; 
    candidateName: string;  
    jobRole: number;  
    profileDate: string;  
    qualification: string;  
    technologies: string;  
    stack: string;  
    candidateType: CandidateType;  
    sourceType: SourceType;  
    referredBy: number;  
    expectedCTC: number;  
    currentCTC: number;  
    experience: number;  
    noticePeriod: number;  
    mobileNumber: string;  
    alternativeMobile?: string;  
    remarks?: string;  
    resumePath?: string; 
    email?: string; 
  
    constructor(  
      candidateName?: string,  
      jobRole?: number,  
      profileDate?: string,  
      qualification?: string,  
      technologies?: string,  
      stack?: string,  
      candidateType?: CandidateType,  
      sourceType?: SourceType,  
      referredBy?: number,  
      expectedCTC?: number,  
      currentCTC?: number,  
      experience?: number,  
      noticePeriod?: number,  
      mobileNumber?: string,  
      alternativeMobile?: string,  
      remarks?: string,  
      resumePath?: string, 
      email?: string 
    ) {  
      this.candidateName = candidateName;  
      this.jobRole = jobRole;  
      this.profileDate = profileDate;  
      this.qualification = qualification;  
      this.technologies = technologies;  
      this.stack = stack;  
      this.candidateType = candidateType;  
      this.sourceType = sourceType;  
      this.referredBy = referredBy;  
      this.expectedCTC = expectedCTC;  
      this.currentCTC = currentCTC;  
      this.experience = experience;  
      this.noticePeriod = noticePeriod;  
      this.mobileNumber = mobileNumber;  
      this.alternativeMobile = alternativeMobile;  
      this.remarks = remarks;  
      this.resumePath = resumePath; 
      this.email = email; 
    }  
  }
  