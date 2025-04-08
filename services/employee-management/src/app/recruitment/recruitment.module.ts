import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitmentEntity } from './entites/requirement.entity';
import { RecruitmentController } from './recruitment.controller';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentRepository } from './entites/requirement-repo';
import { RecruitmentProfileRepository } from './entites/reuirement-profile-repo';
import { CandidateProfileEntity } from './entites/requirement-profile-entity';
import { RecruitmentInterviewsEntity } from './entites/recruitment-interviews.entity';
import { RecruitmentInterviewsRepo } from './entites/recruitment-interviews-repo';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecruitmentEntity,
      CandidateProfileEntity,
      RecruitmentInterviewsEntity,
    ]),
  ],
  controllers: [RecruitmentController],
  providers: [
    ApplicationExceptionHandler,
    RecruitmentRepository,
    RecruitmentService,
    RecruitmentProfileRepository,
    RecruitmentInterviewsRepo,
  ],
})
export class RecruitmentModule {}
