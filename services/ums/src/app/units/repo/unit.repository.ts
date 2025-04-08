import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UnitEntity } from "../entities/units.entity";

@Injectable()
export class UnitsRepository extends Repository<UnitEntity>{
    constructor(private dataSource: DataSource) {
        super(UnitEntity, dataSource.createEntityManager());
    }
}