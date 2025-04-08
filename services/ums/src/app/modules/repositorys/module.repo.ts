import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ModulesEntity } from "../entities/modules.entity";

@Injectable()
export class ModulesRepository extends Repository<ModulesEntity>{
    constructor(private dataSource: DataSource) {
        super(ModulesEntity, dataSource.createEntityManager());
    }
}