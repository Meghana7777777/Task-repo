import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsEntity } from './entites/skills.entity';
import { SkillsRepository } from './repositories/skills.repository';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
@Module({
  imports:[TypeOrmModule.forFeature([SkillsEntity])],
  controllers: [SkillsController],
  providers: [SkillsRepository,SkillsService,ApplicationExceptionHandler]
})
export class SkillsModule {}
