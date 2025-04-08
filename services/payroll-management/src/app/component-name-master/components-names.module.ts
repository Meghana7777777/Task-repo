import { ApplicationExceptionHandler } from "@hrexpert/backend-utils";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComponentNamesEntity } from "./entities/components-names.entity";
import { ComponentNamesController } from "./components-names.controller";
import { ComponentNamesService } from "./components.service";
import { ComponentNamesRepository } from "./repo/component-names-repo";

@Module({
  imports: [
    TypeOrmModule.forFeature([ComponentNamesEntity])
  ],
  controllers: [ComponentNamesController],
  providers: [ComponentNamesService, ComponentNamesRepository,ApplicationExceptionHandler]
})
export class ComponentNamesModule { }