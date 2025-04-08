 

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { GenderEnum, IdentityTypeEnum } from "libs/shared-models/src/lib/ums/ums-common";
import { CreateUserChildDTO } from "./user-child.dto";


export class UsersDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    employeeCode: string;

    @ApiProperty()
    employeeId: string;

    @ApiProperty()
    mobileNo: string;

    @ApiProperty()
    unitId: number

    // @ApiProperty()
    // externalRefNo: string

    // @ApiProperty()
    // gender: GenderEnum;

    // @ApiProperty()
    // identityType: IdentityTypeEnum;

    // @ApiProperty()
    // identityNo: string;

    @ApiProperty()
    userName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    salt: string;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    filesData: any[];

    @ApiProperty()
    userId: number;

    @ApiProperty()
    authenticationId: number;

    @ApiProperty()
    clientId: number;

    @ApiProperty()
    versionFlag: number;
    
    @ApiProperty({ type: () => CreateUserChildDTO, isArray: true })
    @Type(() => CreateUserChildDTO)
    children: CreateUserChildDTO[];

}