import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ScopesEntity } from "../entites/scopes.entity";

@Injectable()
export class ScopesRepository extends Repository<ScopesEntity>{
    constructor(private dataSource: DataSource) {
        super(ScopesEntity, dataSource.createEntityManager());
    }
}