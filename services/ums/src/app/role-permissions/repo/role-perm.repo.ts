import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import {  RolePermissionEntity } from "../entities/role-permissions.entity";

@Injectable()
export class RolePermsRepository extends Repository<RolePermissionEntity>{
    constructor(private dataSource: DataSource) {
        super(RolePermissionEntity, dataSource.createEntityManager());
    }
}