import { Injectable } from '@nestjs/common';
import { UserPermDto } from './dto/user-permission.dto';
import { UserPermissionEntity } from './entities/user-permissions.entity';

@Injectable()
export class UserPermsAdapter {
    convertDtoToEntity(userPermDto: UserPermDto): UserPermissionEntity {
        return
    }
    convertEntityToDto(userPermDto: UserPermissionEntity): UserPermDto {
        return
    }

}