import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ConfigService } from "@nestjs/config";
import { Branches } from "../../../branches/branches.entity";
import { DepartmentsEntity } from "../../../departments/entites/departments-entity";
import { DesignationsEntity } from "../../../designations/entites/designations.entity";
import { Division } from "../../../division/division.entity";
import { Employee } from "../../../employee-onboarding/entities/employee-details.entity";
import { TourClaimEntity } from "../entities/tour-claim-entity";
import { TourIntimationEntity } from "../entities/tour-intimation-entity";

@Injectable()
export class TourClaimRepository extends Repository<TourClaimEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(TourClaimEntity) private tourClaimRepo: Repository<TourClaimEntity>, private readonly configService: ConfigService
    ) {
        super(tourClaimRepo.target, tourClaimRepo.manager, tourClaimRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }


    async gettourClaimDataRepo(req: any): Promise<any> {
        const queryBuilder = this.createQueryBuilder('t')
            .select([
                't.id AS id',
                't.status AS status',
                't.permission_date AS permissionDate',
                't.advance_taken AS advanceTaken',
                't.amount_claimed AS amountClaimed',
                't.sanctioned_amount AS sanctionedAmount',
                't.balance_amount AS balanceAmount',
                't.tour_claim_pdf AS tourClaimPdf',
                't.employee_id AS employeeId',
                't.tour_intimation_id AS tourIntimationId',
                't.remarks AS remarks',
                't.created_at AS appliedDate',
                'e.employee_code AS employeeCode',
                'e.first_name AS firstName',
                'd.name AS departmentName',
                'de.name AS designationName',
                'dv.division_name AS divisionName',
                'b.branch_name AS branchName',
                'd.hod AS hodName',
                'rm.first_name AS rmFirstName',
                'rm.email_id AS rmEmail',
                `(SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'fareDetailsFromPlace', f.from_place,
                        'fareDetailstoPlace', f.to_place,
                        'fareDetailsfromDate', f.from_date,
                        'fareDetailstoDate', f.to_date,
                        'fareDetailstransport', f.transport_mode,
                        'fareDetailsAmount', f.fare_rupees
                    )
                )
                FROM ${this.dbNames.ems}.tc_fare f WHERE f.tour_claim_id = t.id) AS fareDetails`,
                `(SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'taDaDetailsDetails', c.lodging_details,
                        'taDaDetailsFoodExpenses', c.food_expenses,
                        'taDaDetailsDate', c.date,
                        'taDaDetailsAmount', c.tada_rupees
                    )
                )
                FROM ${this.dbNames.ems}.tc_tada c WHERE c.tour_claim_id = t.id) AS taDaDetails`,
                `(SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'localConvyFromPlace', l.from_place,
                        'localConvyToPlace', l.to_place,
                        'localConvyDate', l.date,
                        'localConvytourType', l.transport_mode,
                        'LocalConvyAmount', l.rupees
                    )
                )
                FROM ${this.dbNames.ems}.tc_localconvy l WHERE l.tour_claim_id = t.id) AS localConvyDetails`,
                `(SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'otherExpDate', o.date,
                        'otherExpNatureOfexp', o.nature_of_expenses,
                        'otherExpAmount', o.rupees
                    )
                )
                FROM ${this.dbNames.ems}.tc_otherexpenses o WHERE o.tour_claim_id = t.id) AS otherExpensesDetails`
            ])
            .leftJoin(Employee, 'e', 'e.id = t.employee_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .leftJoin(DepartmentsEntity, 'd', 'd.id = e.department_id')
            .leftJoin(DesignationsEntity, 'de', 'de.id = e.designation_id')
            .leftJoin(Division, 'dv', 'dv.id = e.division_id')
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(TourIntimationEntity, 'td', 'td.id = t.tour_intimation_id')
            .groupBy('t.id')
            .addGroupBy('e.employee_code')
            .addGroupBy('e.first_name')
            .addGroupBy('d.name')
            .addGroupBy('de.name')
            .addGroupBy('b.branch_name')
            .addGroupBy('d.hod');

        if (req.employeeId) {
            queryBuilder.andWhere('t.employee_id = :employeeId', { employeeId: req.employeeId });
        }
        if (req.id) {
            queryBuilder.andWhere('t.id = :id', { id: req.id });
        }
        if (req.branches && req.branches !== 'All') {
            queryBuilder.andWhere('b.id = :branchId', { branchId: req.branches });
        }
        if (req.divisionId) {
            queryBuilder.andWhere('dv.id = :divisionId', { divisionId: req.divisionId });
        }
        if (req.departmentId) {
            queryBuilder.andWhere('d.id = :departmentId', { departmentId: req.departmentId });
        }
        if (req.designationId) {
            queryBuilder.andWhere('de.id = :designationId', { designationId: req.designationId });
        }
        const data = await queryBuilder.getRawMany();
        return data
    }


}