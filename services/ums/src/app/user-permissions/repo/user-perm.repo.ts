import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserPermissionEntity } from "../entities/user-permissions.entity";

@Injectable()
export class UserPermsRepository extends Repository<UserPermissionEntity>{
    constructor(private dataSource: DataSource) {
        super(UserPermissionEntity, dataSource.createEntityManager());
    }
}