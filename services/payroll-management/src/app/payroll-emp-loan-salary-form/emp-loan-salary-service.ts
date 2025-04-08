import { Injectable } from "@nestjs/common";
import { LoanSalaryDto } from "./dto/emp-loan-salary-dto";
import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EmployeeLoanEntity } from "./entity/emp-loan-salary-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { EmpLoanSalaryRepo } from "./emp-loan-salary-repo";
import { configVariables } from "libs/shared-services/src/lib/config";
import { GenericTransactionManager } from "../../database/type-orm-transactions/generic-transaction-manager";
import { DataSource, Repository } from "typeorm";
import moment from "moment";
import { LoanSalaryStatusEnum } from "libs/shared-models/src/lib/enums";
import { EmpNonRecTermsEntity } from "../payroll-records/entites/emp-non-rec-terms.entity";
import dayjs from "dayjs";
import { EmpLoanSalarySharedIdDto } from "@hrexpert/shared-models";
import axios from "axios";

@Injectable()
export class EmpLoanSalaryService {
    constructor(
        private dataSource: DataSource,
        private employeeLoanSalaryRepo: EmpLoanSalaryRepo,
        @InjectRepository(EmpNonRecTermsEntity)
        private empNonRecTermsRepo: Repository<EmpNonRecTermsEntity>

    ) { }

    async createEmployeeLoanSalary(req: LoanSalaryDto): Promise<CommonResponseModel> {
        console.log(req, "llll")

        const transactionManager = new GenericTransactionManager(this.dataSource);
        await transactionManager.startTransaction();
        const len = await this.employeeLoanSalaryRepo.find()
        const x = 10000000
        try {
            const entity = new EmployeeLoanEntity();
            entity.id = req.id;
            entity.employeeId = req.employeeId;
            entity.employeeCode = req.employeeCode;
            entity.firstName = req.firstName;
            entity.designation = req.designation;
            entity.dateOfJoining = req.dateOfJoining;
            entity.type = req.type;
            entity.advanceAmount = req.advanceAmount;
            entity.installments = req.installments;
            entity.effectiveFrom = req.effectiveFrom;
            entity.purpose = req.purpose;
            entity.reason = req.reason;
            entity.amountOutstanding = req.amountOutstanding;
            entity.dateOfApplying = req.dateOfApplying;
            entity.hodMail = req.hodMail;
            entity.loanRefNo = 'lrn' + (x + len.length)

            console.log(entity, "Entity to be saved")

            const save = await this.employeeLoanSalaryRepo.save(entity);

            console.log(save, "Saved Result")
            //await this.sendEmailEmpLoanRequest(req, save)
            const formatDate = (date: any) => moment(date).format('YYYY-MM-DD');
            if (save) {
                const emailReq = {
                'to': [req.hodMail],
                'cc': [req.hodMail],
                'subject': 'Loan/Salary Application Details',
                'body': `
                <html>
                <head>
                  <meta charset="UTF-8" />
                </head>
                <body>
                  <p >Sir/Madam,</p>  
                  <p >I hope this email finds you well. Below are the loan/Salary request details for your review and approval:</p>
                    <p ><span style="font-weight:bold">Employee Name : </span>${req.firstName}</p>
                    <p ><span style="font-weight:bold">Employee Code : </span>${req.employeeCode}</p>
                    <p ><span style="font-weight:bold">Loan Type : </span>${req.type}</p>
                    <p ><span style="font-weight:bold">Advance Amount : </span>${req.advanceAmount}</p>
                    <p ><span style="font-weight:bold">Installments : </span>${req.installments}</p>
                    <p ><span style="font-weight:bold">Effective From : </span>${formatDate(req.effectiveFrom)}</p>
                    <p ><span style="font-weight:bold">Purpose : </span>${req.purpose}</p>
                    <p ><span style="font-weight:bold">Other Reason : </span>${req.reason}</p>
                    <p ><span style="font-weight:bold">Amount Outstanding : </span>${req.amountOutstanding}</p>
                    <p ><span style="font-weight:bold">Date of Applying : </span>${formatDate(req.dateOfApplying)}</p>              
                    <p ><span style="font-weight:bold">HOD Mail : </span>${req.hodMail}</p> 
                    <br>
                    <br>
                    <p>Thank you for Applying your Loan/Salary Process.</p>
                    <br>
                </body>
              </html> ` }
                const response = axios.post("https://alerts.schemaxtech.in/email/send", req, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // <p>To apply for a new loan/salary application, please use the following link: <a href="http://139.59.79.77/hrexpert_dev_app/#/payroll-emp-loan-salary">Employee Loan/Salary Application Form</a>.</p>
                // console.log('working')
                // let effectiveFrom = dayjs(req.effectiveFrom);
                // effectiveFrom = effectiveFrom.add(1, 'month')
                // for (let j = 0; j < req.installments; j++) {
                //     console.log('working loop')
                //     const termEntity = new EmpNonRecTermsEntity();
                //     termEntity.employeeId = req.employeeId;
                //     termEntity.totalTerms = req.installments;
                //     termEntity.termCount = `${j + 1}/${req.installments}`;
                //     termEntity.termAmount = req.advanceAmount / req.installments;
                //     termEntity.payMonth = effectiveFrom.format('YYYYMM');

                //     const save = await this.empNonRecTermsRepo.save(termEntity);

                // }

                //await this.sendEmailEmpLoanRequest(req, save)

                return new CommonResponseModel(true, 2323, 'Created Successfully & Email sent successfully', save);


            } else {
                return new CommonResponseModel(true, 2323, 'failed ', save);

            }
        } catch (err) {
            throw err;
        }
    }


    async getEmpLoanSalary(req: any): Promise<CommonResponseModel> {
        try {
            console.log(req, '----req----')
            const result = await this.employeeLoanSalaryRepo.getEmpLoanSalary(req)
            console.log('working')
            if (result) {
                return new CommonResponseModel(true, 6281481725, "Data Retrieved", result)
            }
            else {
                return new CommonResponseModel(false, 8309649082, "No Data Found")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async updateEmpLoanSalary(req: LoanSalaryDto): Promise<CommonResponseModel> {
        try {
            const result = await this.employeeLoanSalaryRepo.update(
                { id: req.id },
                {
                    employeeCode: req.employeeCode,
                    firstName: req.firstName,
                    designation: req.designation,
                    dateOfJoining: req.dateOfJoining,
                    type: req.type,
                    advanceAmount: req.advanceAmount,
                    installments: req.installments,
                    effectiveFrom: req.effectiveFrom,
                    purpose: req.purpose,
                    reason: req.reason,
                    amountOutstanding: req.amountOutstanding,
                    dateOfApplying: req.dateOfApplying,
                    hodMail: req.hodMail,
                }
            );

            if (result.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully', result);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async sendEmailEmpLoanRequest(req: any, save: EmployeeLoanEntity): Promise<CommonResponseModel> {
        const transactionalManager = new GenericTransactionManager(this.dataSource);
        console.log(req, "++++++++++++++++++++")
        try {
            const axios = require('axios');
            const approveLink = `${configVariables.APP_EMS_SERVICE_URL}/employee-loans/approve/${save.id}`;
            const rejectLink = `${configVariables.APP_EMS_SERVICE_URL}/employee-loans/reject/${save.id}`;
            const formatDate = (date: string) => moment(date).format('YYYY-MM-DD');
            const emailBody = `
            <html>
            <head>
              <meta charset="UTF-8" />
            </head>
            <body>
              <p >Sir/Madam,</p>  
              <p >I hope this email finds you well. Below are the loan/Salary request details for your review and approval:</p>
                <p ><span style="font-weight:bold">Employee Name : </span>${req.firstName}</p>
                <p ><span style="font-weight:bold">Employee Code : </span>${req.employeeCode}</p>
                <p ><span style="font-weight:bold">Designation : </span>${req.designationName}</p>
                <p ><span style="font-weight:bold">Date of Joining : </span>${formatDate(req.dateOfJoining)}</p>
                <p ><span style="font-weight:bold">Loan Type : </span>${req.type}</p>
                <p ><span style="font-weight:bold">Advance Amount : </span>${req.advanceAmount}</p>
                <p ><span style="font-weight:bold">Installments : </span>${req.installments}</p>
                <p ><span style="font-weight:bold">Effective From : </span>${formatDate(req.effectiveFrom)}</p>
                <p ><span style="font-weight:bold">Purpose : </span>${req.purpose}</p>
                <p ><span style="font-weight:bold">Other Reason : </span>${req.reason}</p>
                <p ><span style="font-weight:bold">Amount Outstanding : </span>${req.amountOutstanding}</p>
                <p ><span style="font-weight:bold">Date of Applying : </span>${formatDate(req.dateOfApplying)}</p>              
                <p ><span style="font-weight:bold">HOD Mail : </span>${req.hodMail}</p> 
                <br>
                <br>
                <p>Thank you for Applying your Loan/Salary Process.</p>
                <a href="${approveLink}" style="display: inline-block; padding: 10px 15px; font-size: 14px; color: #fff; text-decoration: none; background-color: #28a745; border-radius: 5px; margin-right: 10px;">
                 Approve
                </a>
                <a href="${rejectLink}" style="display: inline-block; padding: 10px 15px; font-size: 14px; color: #fff; text-decoration: none; background-color: #dc3545;  border-radius: 5px;">
                Reject
                </a>
                <br>
                <p>To apply for a new loan/salary application, please use the following link: <a href="http://139.59.79.77/hrexpert_dev_app/#/payroll-emp-loan-salary">Employee Loan/Salary Application Form</a>.</p>
            </body>
          </html> `;

            const headers = {
                'accept': 'application/json, text/plain, /',
                'content-type': 'application/json',
            };

            const payload = {
                to: [req.hodMail],
                subject: 'Loan/Salary Application Details',
                body: emailBody,
            }
            axios.post(`${configVariables.APP_PMS_SERVICE_URL}/email/send`, payload)
                .then(response => console.log('Email sent successfully:', response.data))
                .catch(error => {
                    console.error('Error occurred:', error.response?.data || error.message);
                    console.error('Status:', error.response?.status);
                })
            await transactionalManager.completeTransaction();
            return new CommonResponseModel(true, 1, 'Data saved & Email request sent to hod successfully', save)
        } catch (err) {
            console.error('Error sending email request:', err);
            throw err;
        }
    }

    async updateLoanStatusWithRemarks(req: { id: number, remarks: string, req: string, componentId: number }): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeLoanSalaryRepo.update(req.id, { status: req.req === 'Approved' ? LoanSalaryStatusEnum.APPROVED : LoanSalaryStatusEnum.REJECTED });
            if (data && req.req === 'Approved') {
                const loanData = await this.employeeLoanSalaryRepo.find({ where: { id: req.id } });
                const loan = loanData[0] as EmployeeLoanEntity;
                for (let j = 0; j < loan.installments; j++) {
                    const termEntity = new EmpNonRecTermsEntity()
                    termEntity.employeeId = loan.employeeId
                    termEntity.componentId = req.componentId
                    termEntity.totalTerms = loan.installments
                    termEntity.termCount = `${j + 1}/${loan.installments}`
                    termEntity.termAmount = loan.advanceAmount / loan.installments
                    termEntity.payMonth = dayjs(loan.effectiveFrom).add(j, 'month').format('YYYYMM');
                    const save = await this.empNonRecTermsRepo.save(termEntity);
                }
            }
            return new CommonResponseModel(true, 1, `${req.req} successfully`, data)
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }

    async updateLoanStatus(id: number, status: LoanSalaryStatusEnum): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeLoanSalaryRepo.update({ id: id }, { status: status });
            if (data && status === LoanSalaryStatusEnum.APPROVED) {
                const loanData = await this.employeeLoanSalaryRepo.find({ where: { id: id } });
                const loan = loanData[0] as EmployeeLoanEntity;
                for (let j = 0; j < loan.installments; j++) {
                    console.log('working loop')
                    const termEntity = new EmpNonRecTermsEntity()
                    termEntity.employeeId = loan.employeeId
                    //termEntity.componentId = req.componentId
                    termEntity.totalTerms = loan.installments
                    termEntity.termCount = `${j + 1}/${loan.installments}`
                    termEntity.termAmount = loan.advanceAmount / loan.installments
                    termEntity.payMonth = dayjs(loan.effectiveFrom).add(j, 'month').format('YYYYMM');
                    const save = await this.empNonRecTermsRepo.save(termEntity);
                }
            }
            return new CommonResponseModel(true, 1, 'status updated successfully', data)
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }

    async getPreviousLoans(req: LoanSalaryDto): Promise<CommonResponseModel> {
        try {
            const result = await this.employeeLoanSalaryRepo.find({
                where: { employeeId: req.employeeId },
                order: { dateOfApplying: 'DESC' },
                select: ['employeeId', 'type', 'advanceAmount', 'dateOfApplying', 'status']
            })
            if (result) {
                return new CommonResponseModel(true, 6281481725, "Data Retrieved", result)
            }
            else {
                return new CommonResponseModel(false, 8309649082, "No Data Found")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getLoansData(req: LoanSalaryDto): Promise<CommonResponseModel> {
        try {
            const result = await this.employeeLoanSalaryRepo.findOne({
                where: { id: req.id },
                order: { dateOfApplying: 'DESC' },
                select: ['employeeId', 'type', 'advanceAmount', 'dateOfApplying', 'status']
            })
            if (result) {
                return new CommonResponseModel(true, 6281481725, "Data Retrieved", result)
            }
            else {
                return new CommonResponseModel(false, 8309649082, "No Data Found")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getEmpLoanSalaryById(req: EmpLoanSalarySharedIdDto): Promise<CommonResponseModel> {
        try {
            const result = await this.employeeLoanSalaryRepo.findOne({ where: { id: req.id } });
            if (result) {
                return new CommonResponseModel(true, 6281481725, "Data Retrieved", result)
            }
            else {
                return new CommonResponseModel(false, 8309649082, "No Data Found")
            }
        } catch (err) {
            console.log(err);
        }
    }

}

