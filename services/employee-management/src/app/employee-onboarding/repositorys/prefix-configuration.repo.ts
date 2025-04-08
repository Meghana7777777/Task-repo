import { CommonResponseModel, EmployeeDetailsDto, EmployeeRMRequest, EmployeeShiftReq } from "@hrexpert/shared-models";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee } from "../entities/employee-details.entity";
import { PrefixConfiguration } from "../entities/prefix-configuration.entity";

@Injectable()
export class PrefixConfigurationRepository extends Repository<PrefixConfiguration> {

    constructor(@InjectRepository(PrefixConfiguration) private prefixConfiguration: Repository<PrefixConfiguration>
    ) {
        super(prefixConfiguration.target, prefixConfiguration.manager, prefixConfiguration.queryRunner);
    }




}