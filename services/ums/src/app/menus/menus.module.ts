import { Module } from '@nestjs/common';
import { MenuService } from './menus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusEntity } from './entities/menus.entity';
import { MenusController } from './menus.controller';
import { MenuAdapter } from './dto/adapter';
import { MenuRepository } from './repo/menu.repo';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  imports: [TypeOrmModule.forFeature([MenusEntity])],
  controllers: [MenusController],
  providers: [MenuService, MenuRepository, MenuAdapter,ApplicationExceptionHandler]
})
export class MenusModule { }
