import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SkillsEntity } from "../entites/skills.entity";


@Injectable()
export class SkillsRepository extends Repository<SkillsEntity> {

    constructor(@InjectRepository(SkillsEntity) private skillsRepository: Repository<SkillsEntity>
    ) {
        super(skillsRepository.target, skillsRepository.manager, skillsRepository.queryRunner);
    }

    async getSkills(): Promise<any> {
        return this.createQueryBuilder('sk')
        .select([
            'sk.id as id',
            'sk.name as name',
            'sk.is_active AS isActive'
        ])
        // .where("sk.is_active = :isActive", { isActive: 1 })
        .getRawMany();
    }
}