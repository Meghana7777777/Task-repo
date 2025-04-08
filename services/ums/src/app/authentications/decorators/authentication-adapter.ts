import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthenticationAdapter {

    // convertDtoToEntity(dto: UsersCreateDto): User {
    //     const entity = new Users();
    //     entity.fullName = dto.fullName;
    //     entity.password = dto.password;
    //     entity.email = dto.email;
    //     entity.salt = dto.salt;
    //     entity.status = ContractStatusEnum.ACTIVE;
    //     entity.isActive = dto.isActive == undefined ? true : dto.isActive
    //     entity.updatedUser = dto.createdUser;
    //     entity.createdUser = dto.createdUser;
    //     return entity;
    // }

}