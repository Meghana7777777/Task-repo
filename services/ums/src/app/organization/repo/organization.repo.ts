import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm"; 
import { Client } from "../entities/organization.entity";

@Injectable()
export class OrganizationRepo extends Repository<Client>{
    constructor(private dataSource: DataSource) {
        super(Client, dataSource.createEntityManager());
    }

}