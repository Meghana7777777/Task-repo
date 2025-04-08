import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DesignationsEntity } from "../entites/designations.entity";


@Injectable()
export class DesignationsRepository extends Repository<DesignationsEntity> {

    constructor(@InjectRepository(DesignationsEntity) private designationsRepository: Repository<DesignationsEntity>
    ) {
        super(designationsRepository.target, designationsRepository.manager, designationsRepository.queryRunner);
    }


    async getDesignations(): Promise<any> {
        return await this.createQueryBuilder('des')
        .select([
            'des.id as id',
            'des.name as name',
            'des.designation_code AS designationCode',
            'des.is_active AS isActive'
        ])
        // .where('des.is_active = :isActive', { isActive: 1 })
        .getRawMany();
    }
}