import { CommonResponseModel, EmployeeDetailsDto, EmployeeRMRequest, EmployeeShiftReq } from "@hrexpert/shared-models";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmployeeFormConfiguration } from "../entities/employee-configuration.entity";

@Injectable()
export class EmployeeFormConfigurationRepository extends Repository<EmployeeFormConfiguration> {

    constructor(@InjectRepository(EmployeeFormConfiguration) private employeeFormConfiguration: Repository<EmployeeFormConfiguration>
    ) {
        super(employeeFormConfiguration.target, employeeFormConfiguration.manager, employeeFormConfiguration.queryRunner);
    }




}