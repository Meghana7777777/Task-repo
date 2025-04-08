import { AllUsersResponseDto, GetAllUsersDto, UnitIdDto } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { CreateUserChildDTO } from 'libs/shared-models/src/lib/ums/ums-common/users/create-user-child.dto';
import { DataSource, Repository } from 'typeorm';
import { AuthenticationEntity } from '../../authentications/entities';
import { Client } from '../../organization/entities/organization.entity';
import { UserChildEntity } from '../entities/user-child.entity';
import { UserEntity } from '../entities/users.entity';
import { UnitEntity } from '../../units/entities/units.entity';

@Injectable()
export class UserRepo extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async getUsersByOrgId(organizationId: number) {
    const queryData = await this.createQueryBuilder('u') // Use "u" alias for userEntity
      .select(
        `u.id as usersId,u.first_name as firstName,u.employee_id as employeeId,u.employee_code as employeeCode,c.id as clientId, c.name as clientName`
      )
      .leftJoin('u.client', 'c')
      .where(`u.client_id = '${organizationId}'`)
      .getRawMany();
    const data = queryData.map((rec) => {
      return new AllUsersResponseDto(
        rec.usersId,
        rec.firstName,
        rec.employeeId,
        rec.employeeCode,
        rec.mobileNo,
        rec.application_id,
        rec.clientId,

        rec.clientName
      );
    });

    return data;
  }

  async findUsersData(id: any): Promise<any> {
    const queryData = await this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    return queryData;
  }


  async getUsersData(req: any): Promise<any> {
    const queryData = await this.createQueryBuilder('u')
      .select([
        'u.id AS userId',
        'u.first_name AS firstName',
        'u.employee_id AS employeeId',
        'u.employee_code AS employeeCode',
        'u.mobile_no AS mobileNo',
        'u.version_flag AS versionFlag',
        'u.is_active AS isActive',
        'u.unit_id AS unitId',
        'uc.user_id AS childUserId',
        'uc.unit_id AS childUnitId',
        'u.authentication_id AS authenticationiId',
        'u.client_id AS clientId',
        'au.email AS email',
        'au.username AS username',
        'un.name AS unitName',
        'un.description AS description',
        
      ])
      .leftJoin(UserChildEntity, 'uc', 'u.id = uc.user_id')
      .leftJoin(AuthenticationEntity, 'au', 'au.id = u.authentication_id')
      .leftJoin(Client, 'c', 'c.id = u.client_id')
      .leftJoin(UnitEntity,'un','un.id =uc.unit_id')
      .where('u.id = :userId', {userId:req.userId}) 
      .getRawMany();
  
    const userMap = new Map<number, GetAllUsersDto>();
    queryData.forEach((rec) => {
      if (!userMap.has(rec.userId)) {
        userMap.set(
          rec.userId, 
          new GetAllUsersDto(
            rec.firstName,
            rec.mobileNo,
            rec.employeeId,
            rec.employeeCode,
            rec.versionFlag,
            rec.isActive,
            rec.userId,
            rec.unitId,
            rec.email,
            rec.userName,
            [] 
          )
        );
      }
  
      if (rec.childUserId) {
        userMap.get(rec.userId).children.push(new CreateUserChildDTO(rec.childUnitId, rec.childUserId,rec.unitName));
      }
    });
  
    return Array.from(userMap.values());
  }
  



}
