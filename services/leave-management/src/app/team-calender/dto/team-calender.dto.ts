import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, MaxLength, Matches, IsOptional, IsNotEmpty } from "class-validator";

export class TeamCalenderDto{

    @ApiProperty()
    id: number;

    @ApiProperty()
    shiftCode: string;

    @ApiProperty()
    fromDate: Date;

    @ApiProperty()
    toDate: Date;

    @ApiProperty()
    shift: number;

    @ApiProperty()
    isActive: boolean;

    createdAt: Date;

    @ApiProperty()
    @IsOptional()
    @MaxLength(40, {message: 'Created User allows maximum 40 characters'})
    @Matches(new RegExp("^(?:[a-zA-Z\\s]|)+$"), {message: "Created User should be only alphabets"})
    createdUser: string;

    updatedAt: Date;

    @ApiProperty()
    @IsOptional()
    @MaxLength(40, {message: 'Updated User allows maximum 40 characters'})
    @Matches(new RegExp('"^(?:[a-zA-Z\\s]|)+$"'), {message: 'Updated User should be only alphabets'})
    updatedUser: string;

    @ApiProperty()
    versionFlag: number;
}