import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AttributesEntity } from "../entities/attributes.entity";

@Injectable()
export class AttributesRepository extends Repository<AttributesEntity>{
    constructor(private dataSource: DataSource) {
        super(AttributesEntity, dataSource.createEntityManager());
    }
}