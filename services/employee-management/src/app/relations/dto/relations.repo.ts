import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Relations } from "../relations.entity";




@Injectable()
export class RelationsRepository extends Repository<Relations> {

    constructor(@InjectRepository(Relations) private relationsRepo: Repository<Relations>
    ) {
        super(relationsRepo.target, relationsRepo.manager, relationsRepo.queryRunner);
    }

    async getAllRelations(): Promise<any> {
        return await this.createQueryBuilder('rel')
            .select([
                'rel.id AS id',
                'rel.relation AS relation',
                'rel.is_active AS isActive'
            ])
            .getRawMany();
    }

}