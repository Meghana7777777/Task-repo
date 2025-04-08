import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ComponentNamesEntity } from "../entities/components-names.entity";

@Injectable()
export class ComponentNamesRepository extends Repository<ComponentNamesEntity> {

    constructor(@InjectRepository(ComponentNamesEntity) private ComponentNamesRepository: Repository<ComponentNamesEntity>
    ) {
        super(ComponentNamesRepository.target, ComponentNamesRepository.manager, ComponentNamesRepository.queryRunner);
    }

    
    async getComponentsNamesRepo(): Promise<any> {
        return this.createQueryBuilder('compn')
        .select([
            'compn.id as id',
            'compn.component_name as componentName',
            'compn.component_name_code as componentNameCode',
            'compn.type as type',
            'compn.round_strg as roundStrg',
            'compn.component_type as componentType',
            'compn.is_derived as isDerived',
            'compn.cut_off_amount as cutOffAmount',
            'compn.calculated_rule as calculatedRule',
            'compn.is_active AS isActive'
        ])
        .getRawMany();
    }


}