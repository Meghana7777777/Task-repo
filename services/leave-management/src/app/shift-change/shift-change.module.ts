import { ApplicationExceptionHandler } from "@hrexpert/shared-models";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShiftChangeController } from "./shift-change.controller";
import { ShiftChangeReqEntity } from "./entity/shift-change.entity";
import { ShiftChangeService } from "./shift-change.service";
import { ShiftChangeRepository } from "./repository/shift-change-repo";

@Module({
    imports: [
      TypeOrmModule.forFeature([ShiftChangeReqEntity]),
    ],
    controllers: [ShiftChangeController],
    providers: [ShiftChangeService,ShiftChangeRepository, ApplicationExceptionHandler]
  })
  export class ShiftChangeModule {}