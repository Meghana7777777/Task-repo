import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationExceptionHandler } from "@hrexpert/backend-utils";
import { DomainEntity } from "./entity/domain.entity";
import { DomainController } from "./domain.controller";
import { DomainService } from "./domain.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            DomainEntity
        ])
    ],
    controllers: [DomainController],
    providers: [DomainService, ApplicationExceptionHandler]
})
export class DomainMOdule { }