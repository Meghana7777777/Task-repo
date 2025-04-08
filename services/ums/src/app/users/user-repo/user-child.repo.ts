import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../entities/users.entity"; 
import { AllUsersResponseDto } from "@hrexpert/shared-models";
import { UserChildEntity } from "../entities/user-child.entity";


@Injectable()
export class UserChildRepo extends Repository<UserChildEntity>{
    constructor(private dataSource: DataSource) {
        super(UserChildEntity, dataSource.createEntityManager());
    }

   
}