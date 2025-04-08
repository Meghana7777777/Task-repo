import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AttendanceDevService } from "./attendance-device.service";
import { AttendanceDevRepository } from "./repository/attendance-device.repo";
import { ApplicationExceptionHandler } from "@hrexpert/backend-utils";
import { AttendanceDevEntity } from "./entity/attendance-device.entity";
import { AttendanceDevController } from "./attendance-device.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AttendanceDevEntity
        ])
    ],
    controllers: [AttendanceDevController],
    providers: [AttendanceDevService,AttendanceDevRepository,ApplicationExceptionHandler]
})
export class AttendanceDevMOdule { }