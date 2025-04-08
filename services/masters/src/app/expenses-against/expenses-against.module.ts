import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationExceptionHandler } from "@hrexpert/backend-utils";
import { ExpensesAgainstEntity } from "./entity/expenses-against.entity";
import { ExpensesAgainstController } from "./expenses-against.controller";
import { ExpensesAgainstService } from "./expenses-against.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            ExpensesAgainstEntity
        ])
    ],
    controllers: [ExpensesAgainstController],
    providers: [ExpensesAgainstService, ApplicationExceptionHandler]
})
export class ExpensesAgainstMOdule { }