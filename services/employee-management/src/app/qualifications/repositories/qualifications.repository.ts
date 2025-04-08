import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QualificationsEntity } from "../entites/qualifications.entity";


@Injectable()
export class QualificationsRepository extends Repository<QualificationsEntity> {

    constructor(@InjectRepository(QualificationsEntity) private qualificationsRepository: Repository<QualificationsEntity>
    ) {
        super(qualificationsRepository.target, qualificationsRepository.manager, qualificationsRepository.queryRunner);
    }

    async getQualifications(): Promise<any> {
        return await this.createQueryBuilder('qual')
            .select([
                'qual.id as id',
                'qual.name AS name',
                'qual.is_active AS isActive'
            ])
        //    .where('qual.is_active = :isActive', { isActive: 1 })
            .getRawMany();
    }

}