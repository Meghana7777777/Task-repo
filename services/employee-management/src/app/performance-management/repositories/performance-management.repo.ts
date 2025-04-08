import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee } from "../../employee-onboarding/entities/employee-details.entity";
import { AchievementsEntity } from "../entites/achievements-entity";
import { PerformanceManagementEntity } from "../entites/performance-management.entity";
import { ReviewRatingsEntity } from "../entites/review-entity";
@Injectable()
export class PerformanceManagementRepository extends Repository<PerformanceManagementEntity> {

    constructor(@InjectRepository(PerformanceManagementEntity) private performanceManagementRepo: Repository<PerformanceManagementEntity>
    ) {
        super(performanceManagementRepo.target, performanceManagementRepo.manager, performanceManagementRepo.queryRunner);
    }
    async getPerformanceManagementRepo(req: any): Promise<any> {
        const { employeeCode } = req;
        const rawData = await this.createQueryBuilder('prms')
            .select([
                'prms.id AS id',
                'prms.emp_code AS employeeCode',
                'prms.emp_name AS employeeName',
                'prms.status AS status',
                'ac.impact_areas AS impactAreas',
                'ac.key_achievements AS keyAchievements',
                'ac.manager_assessments AS managerAssessments',
                're.competence AS competence',
                're.description AS description',
                're.rating AS rating',
                're.remarks AS remarks',
                're.rm_rating AS rmRating',
                're.rm_remarks AS rmRemarks',
            ])
            .leftJoin(AchievementsEntity, 'ac', 'ac.emp_code = prms.emp_code')
            .leftJoin(ReviewRatingsEntity, 're', 're.emp_code = prms.emp_code')
            .where('prms.emp_code = :employeeCode', { employeeCode })
            .getRawMany();

        const resultMap = new Map();
        for (const row of rawData) {
            const empKey = row.employeeCode;

            if (!resultMap.has(empKey)) {
                resultMap.set(empKey, {
                    empInfo: {
                        employeeCode: row.employeeCode,
                        employeeName: row.employeeName,
                        status: row.status,
                        department: row.department || '',
                        designation: row.designation || '',
                        reportingManager: row.reportingManager || '',
                        reviewAchivements: [],
                        reviewRatings: [],
                    }
                });
            }

            const empData = resultMap.get(empKey).empInfo;

            if (row.impactAreas || row.keyAchievements || row.managerAssessments) {
                const achievementExists = empData.reviewAchivements.some(a =>
                    a.impactAreas === row.impactAreas &&
                    a.keyAchievements === row.keyAchievements &&
                    a.managerAssessments === row.managerAssessments
                );
                if (!achievementExists) {
                    empData.reviewAchivements.push({
                        impactAreas: row.impactAreas,
                        keyAchievements: row.keyAchievements,
                        managerAssessments: row.managerAssessments
                    });
                }
            }

            if (row.competence || row.description || row.rating || row.remarks || row.rmRating || row.rmRemarks) {
                const ratingExists = empData.reviewRatings.some(r =>
                    r.competence === row.competence &&
                    r.description === row.description &&
                    r.rating === row.rating &&
                    r.remarks === row.remarks &&
                    r.rmRating === row.rmRating &&
                    r.rmRemarks === row.rmRemarks
                );
                if (!ratingExists) {
                    empData.reviewRatings.push({
                        competence: row.competence,
                        description: row.description,
                        rating: row.rating,
                        remarks: row.remarks,
                        rmRating: row.rmRating,
                        rmRemarks: row.rmRemarks
                    });
                }
            }
        }

        return Array.from(resultMap.values());
    }


    async getStatusFromPeformanceRepo(): Promise<any> {
        const entityManager = this.createQueryBuilder('prms');
        const statusCounts = await entityManager
            .select('prms.status', 'status')
            .addSelect('COUNT(prms.id)', 'count')
            .groupBy('prms.status')
            .getRawMany();
        const totalEmployeeCount = await entityManager.connection
            .getRepository(Employee)
            .createQueryBuilder('emp')
            .getCount();
        const totalEmpFromPerform = await entityManager.connection
            .getRepository(PerformanceManagementEntity)
            .createQueryBuilder('id')
            .getCount();
        const openCount = totalEmployeeCount - totalEmpFromPerform
        return {
            statusCounts,
            totalEmployeeCount,
            totalEmpFromPerform,
            openCount
        };
    }
   
    async getAllReportingManagerRepo(): Promise<any> {
        const entityManager = this.createQueryBuilder('prms')
        .select([
            'prms.id AS id',
            'prms.emp_code AS employeeCode',
            'prms.emp_name AS employeeName',
            'prms.status AS status',
            'ac.impact_areas AS impactAreas',
            'ac.key_achievements AS keyAchievements',
            'ac.manager_assessments AS managerAssessments',
            're.competence AS competence',
            're.description AS description',
            're.rating AS rating',
            're.remarks AS remarks',
            're.rm_rating AS rmRating',
            're.rm_remarks AS rmRemarks',
        ])
        .leftJoin(AchievementsEntity, 'ac', 'ac.emp_code = prms.emp_code')
        .leftJoin(ReviewRatingsEntity, 're', 're.emp_code = prms.emp_code')
        .getRawMany();
        return entityManager
    }




}