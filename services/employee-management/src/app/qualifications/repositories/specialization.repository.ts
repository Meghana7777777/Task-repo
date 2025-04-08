import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QualificationsEntity } from "../entites/qualifications.entity";
import { SpecializationsEntity } from "../entites/specializations.entity";


@Injectable()
export class SpecializationRepository extends Repository<SpecializationsEntity> {

    constructor(@InjectRepository(SpecializationsEntity) private specializationRepository: Repository<SpecializationsEntity>
    ) {
        super(specializationRepository.target, specializationRepository.manager, specializationRepository.queryRunner);
    }

    async getSpecializations(req?: any): Promise<any> {
        const queryBuilder = this.createQueryBuilder('s')
            .select([
                's.id as id',
                's.specialization AS specialization',
                's.qualification_id AS qualificationId',
                'q.name AS qualificationName',
                's.is_active AS isActive'
            ])
            .leftJoin(QualificationsEntity, 'q', 'q.id = s.qualification_id')
        if (req?.qualificationId) {
            queryBuilder.where('s.qualification_id = :qualificationId', { qualificationId: req?.qualificationId });
        }
        return await queryBuilder.getRawMany();
    }

}