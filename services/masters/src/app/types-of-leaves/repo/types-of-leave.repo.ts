import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TypesOfLeaves } from "../types-of-leave.entity";
import { ApplyLeavesStatusReq, CommonResponseModel } from "@hrexpert/shared-models";
import { ConfigService } from "@nestjs/config";




@Injectable()
export class TypesOfLeavesRepository extends Repository<TypesOfLeaves> {
    private readonly dbNames: any

    constructor(@InjectRepository(TypesOfLeaves) private typesOfLeavesRepo: Repository<TypesOfLeaves>,
    private readonly configService: ConfigService
    ) {
        super(typesOfLeavesRepo.target, typesOfLeavesRepo.manager, typesOfLeavesRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }



    async getWeekOfLeavesRepo(): Promise<any> {
        return await this.createQueryBuilder('tl')
            .select([
                'tl.id AS typeOfLeaveId',
                'tl.type_of_leave AS typeOfLeave',
                'tl.leave_code AS leaveCode',
                'tl.default_leaves AS defaultLeaves'
            ])
            .getRawMany();
    }

    async getAllTypesOfLeaves(): Promise<any> {
        return await this.createQueryBuilder('tl')
        .select([
            'tl.id AS id',
            'tl.type_of_leave AS typeOfLeave',
            'tl.leave_code AS leaveCode',
            'tl.default_leaves AS  defaultLeaves',
            'tl.is_active AS isActive'
        ])
        .getRawMany();
    }

    
    async leaveTypeQuery(data: ApplyLeavesStatusReq): Promise<any> {
        let query = `
        SELECT lt.type_of_leave FROM ${this.dbNames.masters}.types_of_leaves lt WHERE lt.id = "${data.typeOfLeave}"`
        return await this.typesOfLeavesRepo.query(query);
    }

}