import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AchievementsEntity } from "../entites/achievements-entity";
@Injectable()
export class AchievementstRepository extends Repository<AchievementsEntity> {

    constructor(@InjectRepository(AchievementsEntity) private achievementsRepo: Repository<AchievementsEntity>
    ) {
        super(achievementsRepo.target, achievementsRepo.manager, achievementsRepo.queryRunner);
    }


}