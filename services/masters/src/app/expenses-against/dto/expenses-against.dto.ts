import { ApiProperty } from "@nestjs/swagger";

export class ExpensesAgainstDto {
    @ApiProperty()
    expenseAgainstId: number;

    @ApiProperty()
    expenseAgainst: string;

    @ApiProperty()
    isActive: boolean;
}