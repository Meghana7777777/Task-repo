import { ApiProperty } from "@nestjs/swagger";

export class ExpensesTypeDto {
    @ApiProperty()
    expenseId: number;

    @ApiProperty()
    expenseType: string;

    @ApiProperty()
    isActive: boolean;
}