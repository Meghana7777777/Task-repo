import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplyOTEntity } from "./entity/apply-ot-entity";
import { ApplyOtController } from "./apply-ot-controller";
import { ApplyOtService } from "./apply-ot-service";
import { ApplyOtRepository } from "./repo/apply-ot-repo";
import { ApplicationExceptionHandler } from "@hrexpert/shared-models";

@Module({
    imports: [
      TypeOrmModule.forFeature([
        ApplyOTEntity
      ])
    ],
    controllers: [ApplyOtController],
    providers: [ApplyOtService, ApplyOtRepository, ApplicationExceptionHandler]
  })
  export class OverTimeModule { }