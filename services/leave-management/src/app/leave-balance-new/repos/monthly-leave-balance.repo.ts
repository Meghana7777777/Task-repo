
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { MonthlyLeaveBalanceLogs } from "../entities/monthly-leave-balance.entity";



@Injectable()
export class MonthlyLeaveBalanceRepository extends Repository<MonthlyLeaveBalanceLogs> {
    private readonly dbNames: any

    constructor(@InjectRepository(MonthlyLeaveBalanceLogs)
    private monthlyLeaveBalanceLogsRepo: Repository<MonthlyLeaveBalanceLogs>,
        private dataSource: DataSource,
        private readonly configService: ConfigService
    ) {
        super(monthlyLeaveBalanceLogsRepo.target, monthlyLeaveBalanceLogsRepo.manager, monthlyLeaveBalanceLogsRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }









}