import { EntityRepository, Repository } from "typeorm";
import { TeamCalender } from "../entity/team-calender.entity";
import { TeamCalenderQueryResponse } from "./team-calender.query.response";
import { InjectRepository } from "@nestjs/typeorm";
import { ShiftReq } from "@hrexpert/shared-models";


export class TeamCalenderRepository extends Repository<TeamCalender> {
    constructor(@InjectRepository(TeamCalender) private teamCalenderRepo: Repository<TeamCalender>
    ) {
        super(teamCalenderRepo.target, teamCalenderRepo.manager, teamCalenderRepo.queryRunner);
    }

    async getShiftGroupRecords(shiftCode: string): Promise<TeamCalenderQueryResponse[]> {
        const query = this.createQueryBuilder('team_calender')
            .select(` shift_code, from_date, to_date, shift `)
            .where(` shift_code = '${shiftCode}'`);
        query.orderBy(` shift_code, from_date`)
        return await query.getRawMany();
    }
    async shiftsbyDateandShiftGroup(req:ShiftReq):Promise<any[]>{
        try{
            console.log(req,'###############')
            const query = await this.createQueryBuilder('s')
            .select(`s.shift,s.id,s.shift_code as shiftCode,s.from_date as fromDate,s.to_date as toDate`)
            .where(`s.shift_code='${req.shiftGroup}'`)
            .andWhere(`"${req.logDate}" BETWEEN s.from_date AND to_date`)
             return await query.getRawMany();

        }catch(err){
            throw err
        }
    }
}