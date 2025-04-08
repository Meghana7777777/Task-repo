import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmployeeResignationProofs } from "../entities/employee-resignation-proofs-entity";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class EmployeeResignRepository extends Repository<EmployeeResignationProofs> {
    private readonly dbNames: any
    constructor(@InjectRepository(EmployeeResignationProofs) 
    private employeeResignationRepo: Repository<EmployeeResignationProofs>,
    private readonly configService: ConfigService,

       
    ) {
        super(employeeResignationRepo.target, employeeResignationRepo.manager, employeeResignationRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }
    
    async getEmpResignationProofs (): Promise <any> {
        let query = `select 
                id, 
                employee_id AS empId, 
                employee_code AS empCode , 
                first_name AS empName , 
                file_name AS fileName , 
                file_path AS filePath,
                original_file_name AS originalFileName
        From ${this.dbNames.ems}.employee_resignation_proofs `
        return await this.employeeResignationRepo.query(query)
    }
   
}
