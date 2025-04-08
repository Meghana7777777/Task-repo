import { ApplicationExceptionHandler } from "@hrexpert/shared-models";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamCalender } from "./entity/team-calender.entity";
import { TeamCalenderAdapter } from "./team-calender.adapter";
import { TeamCalenderController } from "./team-calender.controller";
import { TeamCalenderService } from "./team-calender.service";
import { TeamCalenderRepository } from "./repository/team-calender.repository";

@Module({
    imports: [
      TypeOrmModule.forFeature([TeamCalender]),
    ],
    controllers: [TeamCalenderController],
    providers: [TeamCalenderService, TeamCalenderAdapter,TeamCalenderRepository, ApplicationExceptionHandler]
  })
  export class TeamCalenderModule {}