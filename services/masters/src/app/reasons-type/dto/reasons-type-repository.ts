import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReasonsTypeEntity } from "../reasons-type-entity";



@Injectable()
export class ReasonsTypeRepository extends Repository<ReasonsTypeEntity> {

    constructor(@InjectRepository(ReasonsTypeEntity) private reasonsType: Repository<ReasonsTypeEntity>
    ) {
        super(reasonsType.target, reasonsType.manager, reasonsType.queryRunner);
    }

    async getAllReasonsTypes(): Promise<any> {
        return await this.createQueryBuilder('')
            .select([
                'id',
                'name AS reasonsType',
                'uuid ',
                'company_code ',
                'unit_code ',
                'is_active',
                'created_user ',
                'updated_user ',
                'version_flag ',
                'remarks '
            ])
            .getRawMany();
    }


}