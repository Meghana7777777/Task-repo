import { AttendanceDto } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PfEsiEffDatesEntity } from '../entities/pf-esi-eff-dates.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PfEsiEffDatesRepository extends Repository<PfEsiEffDatesEntity> {
  private readonly dbNames: any;
  constructor(
    @InjectRepository(PfEsiEffDatesEntity)
    private pfEsiEffDatesRepository: Repository<PfEsiEffDatesEntity>,
    private readonly configService: ConfigService,
  ) {
    super(
      pfEsiEffDatesRepository.target,
      pfEsiEffDatesRepository.manager,
      pfEsiEffDatesRepository.queryRunner
    );
    this.dbNames = this.configService.get('dbNames');
  }

  async getEmpDataForPfAndEsi(req?: AttendanceDto): Promise<any> {
    let query = `
    SELECT e.id AS employeeId, CONCAT(e.first_name, ' ', e.last_name) AS fullName, e.employee_code AS employeeCode, e.branch_id AS branchId, b.branch_name AS branchName, pf.pf_eff_from_date AS pfEffFromDate,pf.esic_eff_from_date AS  esicEffFromDate,pf.esic_no AS esicNo,pf.pf_no AS pfNo,pf.is_pf_eligible AS isPfEligible,pf.is_esic_eligible AS isEsicEligible,
    e.department_id AS departmentId, d.name AS departmentName
            FROM ${this.dbNames.ems}.pf_esi_eff_dates pf
            LEFT JOIN ${this.dbNames.ems}.employee e ON pf.emp_id = e.id
            LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = e.branch_id
            LEFT JOIN ${this.dbNames.ems}.departments d ON d.id = e.department_id`;

    const queryParams: any[] = [];

    if (req.employeeId) {
      query += ` AND e.id = ?`;
      queryParams.push(req.employeeId);
    }

    if (req.branchId) {
      query += ` AND e.branch_id = ?`;
      queryParams.push(req.branchId);
    }

    if (req.departmentId) {
      query += ` AND e.department_id = ?`;
      queryParams.push(req.departmentId);
    }

    return await this.pfEsiEffDatesRepository.query(query, queryParams);
  }
}
