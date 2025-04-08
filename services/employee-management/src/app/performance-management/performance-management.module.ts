import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceManagementEntity } from './entites/performance-management.entity';
import { PerformanceManagementController } from './performance-management.controller';
import { PerformanceManagementRepository } from './repositories/performance-management.repo';
import { PerformanceManagementService } from './performance-management.service';
import { AchievementstRepository } from './repositories/achievements.repo';
import { ReviewRatingRepository } from './repositories/review.repo';
import { AchievementsEntity } from './entites/achievements-entity';
import { ReviewRatingsEntity } from './entites/review-entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerformanceManagementEntity,AchievementsEntity,ReviewRatingsEntity])],
  controllers: [PerformanceManagementController],
  providers: [PerformanceManagementService, PerformanceManagementRepository, ApplicationExceptionHandler,AchievementstRepository,ReviewRatingRepository]
})
export class PerformanceManagementModule { }
