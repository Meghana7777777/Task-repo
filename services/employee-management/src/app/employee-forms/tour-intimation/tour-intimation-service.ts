import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TourIntimationRepository } from './repositorys/tour-intimation-repo';
import { CommonResponseModel } from '@hrexpert/backend-utils';
import { TourIntimationEntity } from './entities/tour-intimation-entity';
import { GenericTransactionManager } from 'services/employee-management/src/database/type-orm-transactions';
import { TourDetailsEntity } from './entities/tour-details-entity';
import dayjs from 'dayjs';
import { EmpNonRecurringReq, TourClaimEnum, TourIntimationEnum } from '@hrexpert/shared-models';
import { configVariables, PayrollRecordsSharedService } from '@hrexpert/shared-services';
import path from 'path';
import { TourClaimRepository } from './repositorys/tour-claim-repo';
import { TourClaimEntity } from './entities/tour-claim-entity';
import { TcFareDetailsEntity } from './entities/tour-claim-fare-details';
import { TcLocalConvyDetailsEntity } from './entities/tour-claim-local-convy-details';
import { TcOtherExpDetailsEntity } from './entities/tour-claim-other-exp-details';
import { TcTaDaDetailsEntity } from './entities/tour-claim-taDa-details';
import axios from 'axios';

@Injectable()
export class TourIntimationService {
    constructor(
        private dataSource: DataSource,
        private tourIntimationRepository: TourIntimationRepository,
        private tourClaimRepository: TourClaimRepository
    ) { }

    async createtourIntimation(req: any): Promise<CommonResponseModel> {
        const transactionalManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionalManager.startTransaction();
            const tiCount = await transactionalManager.getRepository(TourClaimEntity).find({ where: { employeeId: req.employeeId, status: TourClaimEnum.OPEN } })
            if (tiCount.length >= 2) {
                return new CommonResponseModel(true, 2, 'You have previous tour claims pending and cannot apply for another.')
            } else {
                const obj: EmpNonRecurringReq = {
                    payRollEmployee: req.employeeId,
                    payRollComponent: req.payRollComponent,
                    totalAmount: req.advanceRequired,
                    emiCount: req.emiCount,
                    emiAmount: req.emiAmount,
                    startDate: req.startDate,
                    endDate: req.endDate
                }
                const entity = new TourIntimationEntity();
                entity.employeeId = req.employeeId
                entity.advanceRequired = req.advanceRequired
                entity.requestedAmount = req.advanceRequired
                entity.componentRecords = obj
                entity.tourType = req.tourType
                entity.purposeOfVisit = req.purposeOfVisit
                const save = await transactionalManager.getRepository(TourIntimationEntity).save(entity)
                if (save) {
                    for (const details of req.employeeTourDetails) {
                        const tourDetailsEntity = new TourDetailsEntity()
                        const tie = new TourIntimationEntity()
                        tie.id = save.id
                        tourDetailsEntity.tourId = tie
                        tourDetailsEntity.fromPlace = details.fromPlace
                        tourDetailsEntity.toPlace = details.toPlace
                        tourDetailsEntity.fromDate = dayjs(details.fromDate).format('YYYY-MM-DD')
                        tourDetailsEntity.toDate = dayjs(details.toDate).format('YYYY-MM-DD')
                        await transactionalManager.getRepository(TourDetailsEntity).save(tourDetailsEntity)
                    }
                }
                const data = await this.tourIntimationRepository.gettourEmployeeDataRepo(req)
                const req1 = {
                    'to': [data.rmEmail],
                    'cc': [req.hodEmail],
                    'subject': `Tour Intimation Request`,
                    'body': `
                <html>
                <head>
                  <meta charset="UTF-8" />
                </head>
                <body>
                  <p><span style="font-weight:bold">To : </span> ${data.rmFirstName},</p>
                  <p >Sir/Madam,</p>  
                  <p >I hope this email finds you well. I am writing to inform you that I am planning to go on a tour. During this period, I will not be available for regular duties.</p>
                  <p>Details of the Tour submitted in the form please check and validate</p>
                  <p>I kindly request your approval for this tour. Please let me know if you need any further details or if there are forms to be submitted for official purposes.</p>
                  <p>Thank you for your understanding and support.</p>
              <a href="${configVariables.APP_EMS_SERVICE_URL}tour-intimation-details?${data.employeeId + "-" + save.id}" target='_blank'>Tour Information Details</a>
                  <p>Please click link below for the Information of tour and for response upload</p>
                  <p>You can click below link to add remarks and  Approve & Reject</p>
                </body>
              </html> `}
                const response = axios.post("https://alerts.schemaxtech.in/email/send", req1, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                //         const axios = require('axios');
                //         const approveLink = `${configVariables.APP_EMS_SERVICE_URL}/tour-intimation/approve/${save.id}`;
                //         const rejectLink = `${configVariables.APP_EMS_SERVICE_URL}/tour-intimation/reject/${save.id}`;
                //         const emailBody = `
                //     <html>
                //     <head>
                //       <meta charset="UTF-8" />
                //     </head>
                //     <body>
                //       <p><span style="font-weight:bold">To : </span> ${data.rmFirstName},</p>
                //       <br></br>
                //       <p >Sir/Madam,</p>  
                //       <p >I hope this email finds you well. I am writing to inform you that I am planning to go on a tour. During this period, I will not be available for regular duties.</p>
                //       <p>Details of the Tour submitted in the form please check and validate</p>
                //       <p>I kindly request your approval for this tour. Please let me know if you need any further details or if there are forms to be submitted for official purposes.</p>
                //       <p>Thank you for your understanding and support.</p>
                //       <p ><span style="font-weight:bold">Employee Name : </span>${data[0]?.firstName}</p>
                //       <p ><span style="font-weight:bold">Employee Code : </span>${data[0]?.employeeCode}</p>
                //       <p ><span style="font-weight:bold">Department : </span>${data[0]?.departmentName}</p>
                //       <p ><span style="font-weight:bold">Designation : </span>${data[0]?.designationName}</p>   
                //       <p ><span style="font-weight:bold">Branch : </span>${data[0]?.branchName}</p> 
                //       <p>Please click link below for the Information of tour and for response upload</p>
                //       <p>You can click below link to add remarks and  Approve & Reject</p>
                //       <a href="${configVariables.APP_EMS_SERVICE_URL}tour-intimation-details?${req.employeeId + "-" + save.id}" target='_blank'>Tour Information Details</a>
                //       <p>You can Approve or Reject below directly in email </p>
                //         <a href="${approveLink}" style="display: inline-block; padding: 10px 15px; font-size: 14px; color: #fff; text-decoration: none; background-color: #28a745; border-radius: 5px; margin-right: 10px;">
                //          Approve
                //         </a>
                //         <a href="${rejectLink}" style="display: inline-block; padding: 10px 15px; font-size: 14px; color: #fff; text-decoration: none; background-color: #dc3545;  border-radius: 5px;">
                //         Reject
                //         </a>
                //     </body>
                //   </html> `;

                //         const payload = {
                //             to: [data[0]?.rmEmail, req.hodEmail],
                //             subject: 'Tour Intimation Permission',
                //             body: emailBody,
                //         }
                //         axios.post(`${configVariables.APP_PMS_SERVICE_URL}/email/send`, payload)
                //             .then(response => console.log('Email sent successfully:', response.data))
                //             .catch(error => {
                //                 console.error('Error occurred:', error.response?.data || error.message);
                //                 console.error('Status:', error.response?.status);
                //             })
                await transactionalManager.completeTransaction();
                return new CommonResponseModel(true, 1, 'Data saved & Email request sent to hod successfully', save)
            }
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            await transactionalManager.releaseTransaction();
            throw err;
        }
    }

    async gettourIntimation(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.tourIntimationRepository.getTourIntimationDataRepo(req)
            return new CommonResponseModel(true, 1, 'Data Retrived successfully', data)
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }

    async gettourEmployeeData(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.tourIntimationRepository.gettourEmployeeDataRepo(req)
            return new CommonResponseModel(true, 1, 'Data Retrived successfully', data)
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }

    async updateTourStatus(id: number, status: TourIntimationEnum): Promise<CommonResponseModel> {
        try {
            const data = await this.tourIntimationRepository.update(id, { permission: status, permissionDate: new Date() });
            return new CommonResponseModel(true, 1, 'status updated successfully', data)
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }

    async updateTourStatuswithRemarks(req: { id: number, remarks: string, req: string, permissionAmount: number }): Promise<CommonResponseModel> {
        try {
            let obj: EmpNonRecurringReq
            const tourData = await this.tourIntimationRepository.find({ where: { id: req.id } });
            const tourEntity = tourData[0] as TourIntimationEntity;
            let records = tourEntity.componentRecords as EmpNonRecurringReq;
            req.permissionAmount ? records.totalAmount = req.permissionAmount : null
            req.permissionAmount ? records.emiAmount = (req.permissionAmount) / (records.emiCount) : null
            obj = records
            const data = await this.tourIntimationRepository.update(req.id, {
                permission: req.req === 'Approved' ? TourIntimationEnum.APPROVED : TourIntimationEnum.REJECTED,
                permissionDate: new Date(),
                remarks: req.remarks,
                componentRecords: obj,
                advanceRequired: req.permissionAmount ? String(req.permissionAmount) : String((records.emiAmount) * (records.emiCount)),
            });

            // if (data && req.req === 'Approved') {
            //     const tourData = await this.tourIntimationRepository.find({ where: { id: req.id } });
            //     const tourEntity = tourData[0] as TourIntimationEntity;

            //     if (!tourEntity.componentRecords) {
            //         throw new Error('Component records not found for the tour entity.');
            //     }
            //     const records = tourEntity.componentRecords as EmpNonRecurringReq;
            //     const payrollRecordsSharedService = new PayrollRecordsSharedService();
            //     payrollRecordsSharedService.createEmpNonRecurring(records).then((res) => {
            //         if (res.status) {
            //             console.log('Successfully created non-recurring request');
            //         } else {
            //             console.log('Failed to create non-recurring request');
            //         }
            //     });
            // }
            return new CommonResponseModel(true, 1, `${req.req} successfully`);
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }

    async pdfUploadTemp(filePath: string, filename: string, originalname: string, data: any): Promise<CommonResponseModel> {
        try {
            const filePathData = {
                pathName: filePath,
                filename: filename,
                path: path.join(filePath, filename)
            };
            return new CommonResponseModel(true, 1, 'File uploaded successfully', filePathData)
        } catch (error) {
            console.error('File upload error:', error);
            return new CommonResponseModel(true, 1, 'File upload failed', '')
        }
    }

    async createtourClaim(req: any): Promise<CommonResponseModel> {
        const transactionalManager = new GenericTransactionManager(this.dataSource);
        try {
            console.log(req, '------------req-------------')
            await transactionalManager.startTransaction();
            const entity = new TourClaimEntity();
            entity.employeeId = req.employeeId
            entity.tourIntimationId = req.tourIntimationId
            entity.advanceTaken = req.advanceTaken
            entity.amountClaimed = req.amountClaimed
            entity.tourClaimPdf = req.tourClaimPdf
            const save = await transactionalManager.getRepository(TourClaimEntity).save(entity)
            if (save) {
                for (const f of req.fareDetails) {
                    const fareEntity = new TcFareDetailsEntity()
                    fareEntity.tourClaimId = save.id
                    fareEntity.fromPlace = f.fareDetailsFromPlace
                    fareEntity.toPlace = f.fareDetailstoPlace
                    fareEntity.fromDate = dayjs(f.fareDetailsfromDate).format('YYYY-MM-DD')
                    fareEntity.toDate = dayjs(f.fareDetailstoDate).format('YYYY-MM-DD')
                    fareEntity.transportMode = f.fareDetailstransport
                    fareEntity.fareRupees = f.fareDetailsAmount
                    await transactionalManager.getRepository(TcFareDetailsEntity).save(fareEntity)
                }
                for (const t of req.taDaDetails) {
                    const tadaEntity = new TcTaDaDetailsEntity()
                    tadaEntity.tourClaimId = save.id
                    tadaEntity.lodgingDetails = t.taDaDetailsDetails
                    tadaEntity.foodExpenses = t.taDaDetailsFoodExpenses
                    tadaEntity.date = dayjs(t.taDaDetailsDate).format('YYYY-MM-DD')
                    tadaEntity.tadaRupees = t.taDaDetailsAmount
                    await transactionalManager.getRepository(TcTaDaDetailsEntity).save(tadaEntity)
                }
                for (const c of req.localConvyDetails) {
                    const convyEntity = new TcLocalConvyDetailsEntity()
                    convyEntity.tourClaimId = save.id
                    convyEntity.fromPlace = c.localConvyFromPlace
                    convyEntity.toPlace = c.localConvyToPlace
                    convyEntity.date = dayjs(c.localConvyDate).format('YYYY-MM-DD')
                    convyEntity.transportMode = c.localConvytourType
                    convyEntity.rupees = c.LocalConvyAmount
                    await transactionalManager.getRepository(TcLocalConvyDetailsEntity).save(convyEntity)
                }
                for (const o of req.otherExpensesDetails) {
                    const othrtexpEntity = new TcOtherExpDetailsEntity()
                    othrtexpEntity.tourClaimId = save.id
                    othrtexpEntity.date = dayjs(o.otherExpDate).format('YYYY-MM-DD')
                    othrtexpEntity.natureOfExpenses = o.otherExpNatureOfexp
                    othrtexpEntity.rupees = o.otherExpAmount
                    await transactionalManager.getRepository(TcOtherExpDetailsEntity).save(othrtexpEntity)
                }
                await transactionalManager.getRepository(TourIntimationEntity).update(req.tourIntimationId, { tourClaim: true })
            }
            await transactionalManager.completeTransaction();
            return new CommonResponseModel(true, 1, 'Data saved successfully', save)
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            await transactionalManager.releaseTransaction();
            throw err;
        }
    }

    async gettourClaim(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.tourClaimRepository.gettourClaimDataRepo(req)
            if(data.length>0){
            return new CommonResponseModel(true, 1, 'Data Retrived successfully', data)
            }else{
            return new CommonResponseModel(false, 0, 'No Data Found', [])
            }
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }

    async TourClaimReject(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.tourClaimRepository.update(req.id, { status: TourClaimEnum.REJECTED, remarks: req.remarks })
            return new CommonResponseModel(true, 1, 'Rejected successfully', data)
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }

    async TourClaimApprove(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.tourClaimRepository.update(req.id, { status: TourClaimEnum.APPROVED, remarks: req.remarks, sanctionedAmount: req.sanctionedAmount, balanceAmount: req.balanceAmount })
            return new CommonResponseModel(true, 1, 'Approved successfully', data)
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }
}


