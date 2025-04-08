import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MenusEntity } from "../entities/menus.entity";

@Injectable()
export class MenuRepository extends Repository<MenusEntity>{
    constructor(private dataSource: DataSource) {
        super(MenusEntity, dataSource.createEntityManager());
    }
}