import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BankDetailsEntity } from "../entities/bank-details.entity";

@Injectable()
export class BankDetailsRepository extends Repository<BankDetailsEntity> {

    constructor(@InjectRepository(BankDetailsEntity) private BankDetailsRepository: Repository<BankDetailsEntity>
    ) {
        super(BankDetailsRepository.target, BankDetailsRepository.manager, BankDetailsRepository.queryRunner);
    }




}