import { CommonResponseModel, HolidayReqForGenerateSwipe } from "@hrexpert/shared-models";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HolidaysEntity } from "../holiday_calendar.entity";
import { ConfigService } from "@nestjs/config";



@Injectable()
export class HolidaysRepository extends Repository<HolidaysEntity> {
    private readonly dbNames: any
    constructor(@InjectRepository(HolidaysEntity) private holidayRepo: Repository<HolidaysEntity>,
    private readonly configService: ConfigService
    ) {
        super(holidayRepo.target, holidayRepo.manager, holidayRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }


    async getHolidayDatesRepo(): Promise<any[]> {
        return await this.createQueryBuilder('holiday')
            .select('DATE(holiday.date)', 'holidayDate')
            .addSelect('holiday.branch_id', 'branchId') 
            .addSelect('holiday.type', 'holidayType') 
            .getRawMany();
    }
    

    async getActiveHolidays(req:any): Promise<any> {
        let query = `SELECT h.id AS id, h.name AS holidayName, h.date AS holidayDate,h.is_active AS isActive, h.type AS type, h.branch_id AS branchId , b.branch_name AS branchName
        FROM ${this.dbNames.lms}.holidays h 
        LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = h.branch_id WHERE h.id > 0 `;
        if (req.branchId != undefined) {
            query = query + `AND h.branch_id = ${req.branchId}`
        }
        return await this.holidayRepo.query(query)
    }

    async getActiveWeekOffAndHoliday(req:HolidayReqForGenerateSwipe): Promise<any> {
        let query = `
            SELECT 
                h.id AS id, 
                h.name AS holidayName, 
                h.date AS holidayDate, 
                h.is_active AS isActive, 
                h.type AS type, 
                h.branch_id AS branchId, 
                b.branch_name AS branchName
            FROM ${this.dbNames.lms}.holidays h 
            LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = h.branch_id 
            WHERE h.is_active = 1 AND h.date = '${req.date}'`;
        if (req.branchId) {
            query += ` AND h.branch_id = ${req.branchId}`;
        }
    
        return await this.holidayRepo.query(query);
    }
    

}