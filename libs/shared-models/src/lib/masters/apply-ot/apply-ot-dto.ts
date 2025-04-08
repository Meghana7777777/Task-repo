import { LeaveApprovalStatusEnum } from "@hrexpert/shared-models";

export class ApplyForOTDto { 
    employeeName: string;
    date: string;
    inTime: Date;
    outTime: Date;
    workingHours: string;
    status: LeaveApprovalStatusEnum;
    createdAt: Date;
    createdUser: string | null;
    updatedAt: Date;
    updatedUser: string | null;
    versionFlag: number;
    id?: number
    
    constructor(
    employeeName: string ,
    date: string ,
    inTime: Date ,
    outTime: Date ,
    workingHours: string ,
    status: LeaveApprovalStatusEnum ,
    createdAt: Date ,
    createdUser: string | null ,
    updatedAt: Date ,
    updatedUser: string | null ,
    versionFlag: number ,
    id?:number
    
    )  {
    this.employeeName= employeeName 
    this.date= date
    this.inTime= inTime
    this.outTime= outTime
    this.workingHours= workingHours
    this.status= status
    this.createdAt= createdAt
    this.createdUser= createdUser  
    this.updatedAt= updatedAt
    this.updatedUser= updatedUser 
    this.versionFlag= versionFlag
    this.id = id
    }
  }
  