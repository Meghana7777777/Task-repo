import { Module } from '@nestjs/common';
import { UserToAttributesService } from './user-to-attributes.service';
import { UserToAttributesController } from './user-to-attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToAttributes } from './entities/user-to-attributes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserToAttributes])],
  controllers: [UserToAttributesController],
  providers: [UserToAttributesService]
})
export class UserToAttributesModule { }
