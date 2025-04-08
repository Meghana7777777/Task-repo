import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AuthenticationEntity } from "../entities";
import { UsersFileUploadDataDto, UsersResponseDto } from "libs/shared-models/src/lib/ums/ums-common";


@Injectable()
export class AuthenticationRepository extends Repository<AuthenticationEntity>{
    constructor(private dataSource: DataSource) {
        super(AuthenticationEntity, dataSource.createEntityManager());
      }


      async getAllUsers() {
        const queryData = await this.createQueryBuilder("users")
            .select(`users.users_id,users.full_name,users.email,users.status,users.created_at,users.updated_at,users.created_user,users.updated_user,users.version_flag`)
            .addSelect(`fu.file_name ,fu.original_name ,fu.last_modified ,fu.last_modified_date ,fu.percent,fu.file_path`)
            // .leftJoin(FileUpload, 'fu', 'users.users_id = fu.features_ref_no')
            .getRawMany()
        const data = queryData.map((rec => {
            const files = new UsersFileUploadDataDto(rec.file_name, rec.original_name, rec.last_modified, rec.last_modified_date, rec.percent, rec.file_path, rec.version_flags)
            return new UsersResponseDto(rec.users_id, rec.full_name, rec.email, rec.status, rec.status, rec.created_at, rec.updated_at, rec.created_user, rec.updated_user, [files], rec.version_flag)
        }))
        return data
    }
}