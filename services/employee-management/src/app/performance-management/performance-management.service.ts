import { CommonResponseModel } from '@hrexpert/backend-utils';
import { Injectable } from '@nestjs/common';
import { AchievementsEntity } from './entites/achievements-entity';
import { PerformanceManagementEntity } from './entites/performance-management.entity';
import { ReviewRatingsEntity } from './entites/review-entity';
import { AchievementstRepository } from './repositories/achievements.repo';
import { PerformanceManagementRepository } from './repositories/performance-management.repo';
import { ReviewRatingRepository } from './repositories/review.repo';
@Injectable()
export class PerformanceManagementService {
    constructor(
        private performRepo: PerformanceManagementRepository,
        private achievementRepo: AchievementstRepository,
        private reviewRepo: ReviewRatingRepository,
    ) { }

    async createPerformanceForm(req: any): Promise<CommonResponseModel> {
        try {
            const { employeeCode, employeeName, status } = req.empInfo;
            const existingPerformance = await this.performRepo.find({ where: { employeeCode } });
            if (existingPerformance && existingPerformance.length > 0) {
                await this.performRepo.update({ employeeCode }, { employeeName, status });
            } else {
                const newEmp = new PerformanceManagementEntity();
                newEmp.employeeCode = employeeCode;
                newEmp.employeeName = employeeName;
                newEmp.status = status;
                await this.performRepo.save(newEmp);
            }
            const achievementExists = await this.achievementRepo.find({ where: { employeeCode } });
            if (achievementExists && achievementExists.length > 0) {
                for (const [index, recc] of req.empInfo.reviewAchivements.entries()) {
                    await this.achievementRepo.update({ id: achievementExists[index].id }, { impactAreas: recc.impactAreas, keyAchievements: recc.keyAchievements, managerAssessments: recc.managerAssessments })
                }
            } else {
                for (const recc of req.empInfo.reviewAchivements) {
                    const achievementEntity = new AchievementsEntity();
                    achievementEntity.employeeCode = employeeCode;
                    achievementEntity.impactAreas = recc.impactAreas || '';
                    achievementEntity.keyAchievements = recc.keyAchievements || '';
                    achievementEntity.managerAssessments = recc.managerAssessments || '';
                    await this.achievementRepo.save(achievementEntity);
                }
            }
            const ratingExists = await this.reviewRepo.find({ where: { employeeCode } });
            if (ratingExists  && ratingExists.length > 0) {
                for (const [index, recc] of req.empInfo.reviewRatings.entries()) {
                    await this.reviewRepo.update({ id: ratingExists[index].id }, { competence: recc.competence, description: recc.description, rating: recc.rating, remarks: recc.remarks, rmRating: recc.rmRating, rmRemarks: recc.rmRemarks })
                }
            } else {
                for (const recc of req.empInfo.reviewRatings) {
                    const ratingEntity = new ReviewRatingsEntity();
                    ratingEntity.employeeCode = employeeCode;
                    ratingEntity.competence = recc.competence;
                    ratingEntity.description = recc.description || '';
                    ratingEntity.rating = recc.rating || '';
                    ratingEntity.remarks = recc.remarks || '';
                    ratingEntity.rmRating = recc.rmRating || '';
                    ratingEntity.rmRemarks = recc.rmRemarks || '';
                    await this.reviewRepo.save(ratingEntity);
                }
            }
            return new CommonResponseModel(true, 1, "Data Saved Successfully");
        } catch (err) {
            console.error(err);
            return new CommonResponseModel(false, 0, "Error in Performance Form Creation");
        }
    }



    async getPerformanceManagement(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.performRepo.getPerformanceManagementRepo(req)
            return new CommonResponseModel(true, 1, "Get Data", data)
        } catch (err) {
            return new CommonResponseModel(false, 0, "Catch")
        }
    }
    
    async getStatusFromPeformance(): Promise<CommonResponseModel> {
        try {
            const data = await this.performRepo.getStatusFromPeformanceRepo()
            return new CommonResponseModel(true, 1, "Get Data", data)
        } catch (err) {
            return new CommonResponseModel(false, 0, "Catch")
        }
    }
    
    async getAllReportingManager(): Promise<CommonResponseModel> {
        try {
            const data = await this.performRepo.getAllReportingManagerRepo()
            return new CommonResponseModel(true, 1, "Get Data", data)
        } catch (err) {
            return new CommonResponseModel(false, 0, "Catch")
        }
    }
}
