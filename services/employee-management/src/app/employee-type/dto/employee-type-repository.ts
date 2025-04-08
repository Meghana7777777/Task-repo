import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmployeeType } from "./employee-type-entity";



@Injectable()
export class EmployeeTypeRepository extends Repository<EmployeeType> {

    constructor(@InjectRepository(EmployeeType) private emType: Repository<EmployeeType>
    ) {
        super(emType.target, emType.manager, emType.queryRunner);
    }

    async getAllEmployeeTypes(): Promise<any> {
        return await this.createQueryBuilder('empType')
            .select([
                'empType.id as id',
                'empType.name as name',
                'empType.uuid as unitId',
                'empType.company_code AS companyCode',
                'empType.unit_code AS unitCode',
                'empType.is_active AS isActive',
                'empType.created_user AS createdUser',
                'empType.updated_user AS updatedUser',
                'empType.version_flag AS versionFlag',
                'empType.remarks as remarks'
            ])
            .getRawMany();
    }


}