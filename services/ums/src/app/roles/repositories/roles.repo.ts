import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RolesEntity } from "../entities/roles.entity";




@Injectable()
export class RolesRepository extends Repository<RolesEntity>{
    constructor(private dataSource: DataSource) {
        super(RolesEntity, dataSource.createEntityManager());
    }
}