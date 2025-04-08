import { GenderEnum } from "../ums-common";

export class GetAllUserDto {
    employeeId: string;
    mobileNo: string;
    email:string;
    isActive: boolean;
    employeeCode: string;
    versionFlag: number;
    
    userId: number;
    //firstName: string;
    // firstName: string;
    // employeeId: string;
    // employeeCode: string;
    // gender: GenderEnum;
    // mobileNo: string;
    // versionFlag: number;
    // isActive: boolean;
    // userId: number;
    // externalRefNo: string;
    // identityNo: string;
    // identityType: string;
    constructor(
        employeeId: string,
        mobileNo: string,
        email:string,
        isActive: boolean,
        employeeCode: string,
        versionFlag: number,
        
        userId: number,
        //firstName: string,
    //     firstName: string,
    //     employeeId: string,
    // employeeCode: string,
    //     // middleName: string,
    //     // lastName: string,
    //     // gender: GenderEnum,
    //      mobileNo: string,
    //     versionFlag: number,
    //     isActive: boolean,
    //     userId: number,
        // externalRefNo: string,
        // identityNo: string,
        // identityType: string,
        ) {
            this.employeeId = employeeId
            this.mobileNo = mobileNo
            this.email = email
            this.isActive = isActive
            this.employeeCode = employeeCode
            this.versionFlag =versionFlag
            this.userId = userId
            //this.firstName =firstName
        // this.firstName = firstName;
        // this.employeeId = employeeId
        // this.employeeCode = employeeCode;
        // this.middleName = middleName;
        // this.lastName = lastName;
        // this.gender = gender;
        //  this.mobileNo = mobileNo;
        // this.userId = userId;
        // this.isActive = isActive;
        // this.externalRefNo = externalRefNo;
        // this.versionFlag = versionFlag;
        // this.identityNo = identityNo;
        // this.identityType = identityType;
    }
}