import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IdProof } from "./id-proof-entity";



@Injectable()
export class IdProofRepository extends Repository<IdProof> {

    constructor(@InjectRepository(IdProof) private idProofRepo: Repository<IdProof>
    ) {
        super(idProofRepo.target, idProofRepo.manager, idProofRepo.queryRunner);
    }

    async getAllIdProofs(): Promise<any>{
        return await this.createQueryBuilder('idp')
        .select([
            'idp.id as id',
            'idp.name as name',
            'idp.uuid as unitId',
            'idp.company_code as companyCode',
            'idp.unit_code as unitCode',
            'idp.is_active as isActive',
            'idp.created_user as createdUser',
            'idp.updated_user as updatedUser',
            'idp.version_flag as versionFlag',
            'idp.remarks as remarks'
        ])
        .getRawMany();
    }
   
}