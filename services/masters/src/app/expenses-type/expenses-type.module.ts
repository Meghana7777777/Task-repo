import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationExceptionHandler } from "@hrexpert/backend-utils";
import { ExpensesTypeEntity } from "./entity/expenses-type.entity";
import { ExpensesTypeController } from "./expenses-type.controller";
import { ExpensesTypeService } from "./expenses-type.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            ExpensesTypeEntity
        ])
    ],
    controllers: [ExpensesTypeController],
    providers: [ExpensesTypeService, ApplicationExceptionHandler]
})
export class ExpensesTypeMOdule { }