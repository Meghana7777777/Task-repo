import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsInt, Min, Max } from "class-validator";

export class DateMonthReq {
    @ApiProperty({ example: 15, description: "Day of the month (1-31)" })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(31)
    date?: number;

    @ApiProperty({ example: 8, description: "Month of the year (1-12)" })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(12)
    month?: number;
}
