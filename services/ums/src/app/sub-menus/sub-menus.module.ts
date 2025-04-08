import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubMenuEntity } from './entities/sub-menus.entity';
import { SubMenuRepository } from './repo/sub-menu-repo';
import { SubMenuController } from './sub-menus.controller';
import { SubMenusService } from './sub-menus.service';
import { SubMenuAdapter } from './sub-menu-adapter';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  imports: [TypeOrmModule.forFeature([SubMenuEntity])],
  controllers: [SubMenuController],
  providers: [SubMenusService,SubMenuRepository,SubMenuAdapter,ApplicationExceptionHandler]
})
export class SubMenusModule { }
