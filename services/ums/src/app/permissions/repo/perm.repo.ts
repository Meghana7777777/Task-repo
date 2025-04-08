import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PermissionsEntity } from "../entities/permissions.entity";

@Injectable()
export class PermsRepository extends Repository<PermissionsEntity>{
    constructor(private dataSource: DataSource) {
        super(PermissionsEntity, dataSource.createEntityManager());
    }
}