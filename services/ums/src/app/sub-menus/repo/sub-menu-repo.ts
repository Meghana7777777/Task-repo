import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SubMenuEntity } from "../entities/sub-menus.entity";

@Injectable()
export class SubMenuRepository extends Repository<SubMenuEntity>{
    constructor(private dataSource: DataSource) {
        super(SubMenuEntity, dataSource.createEntityManager());
    }
}