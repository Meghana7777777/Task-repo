import { CommonResponseModel } from '@hrexpert/backend-utils';
import { PayrollProcessedLogReq } from '@hrexpert/shared-models';
import { MonthWIseEmpReportReq, PayrollComponentsSharedService, WhatsUpService } from '@hrexpert/shared-services';
import { Injectable } from '@nestjs/common';
import path from 'path';
import { In } from 'typeorm';
import { PayrollComponentsRepository } from '../payroll-components/repositories/payroll-components.repository';
import { PayrollProcessedLogRepository } from './payroll-processed-log.repository';
@Injectable()
export class PayrollProcessedLogService {
    constructor(
        private payrollProcessedLogRepository: PayrollProcessedLogRepository,
        private payrollComponentsRepo: PayrollComponentsRepository,
        private payrollComponentsService: PayrollComponentsSharedService,
        private whatsService: WhatsUpService,
    ) { }

    async getPayrollProcessedLog(req: PayrollProcessedLogReq): Promise<CommonResponseModel> {
        try {
            let result
            if (req.payrollMonth) {
                result = await this.payrollProcessedLogRepository.getPayrollProcessedLogRepo(req)
            } else {
                return new CommonResponseModel(false, 111, "Please select a month");
            }
            const dynamicColumns = Array.isArray(result) ? result : result.data || [];
            const finalResult = dynamicColumns.map((record: any) => {
                if (record.componentRecords) {
                    try {
                        const parsedComponents = JSON.parse(record.componentRecords);
                        const componentKeys = Object.entries(parsedComponents).map(([key, value]) => ({
                            [key]: value,
                        }));
                        return { ...record, componentKeys, };
                    } catch (error) {
                        console.error("Invalid JSON in componentRecords:", record.componentRecords, error);
                        return { ...record, componentKeys: [], };
                    }
                }
                return { ...record, componentKeys: [], };
            });

            // console.log(finalResult, "finalResult");

            if (finalResult) {
                return new CommonResponseModel(true, 1, "Data Retrived", finalResult)
            } else {
                return new CommonResponseModel(false, 0, "Failed")
            }
        } catch (err) {
            return new CommonResponseModel(false, 111, "Failed to Retrieve Data", err);
        }
    }

    async getPayrollMonth(req: PayrollProcessedLogReq): Promise<CommonResponseModel> {
        try {
            const data = await this.payrollProcessedLogRepository.getPayrollMonth(req)
            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Data retrieved', data)
            } else {
                return new CommonResponseModel(false, 0, 'No Data', [])
            }
        } catch (error) {
            return new CommonResponseModel(false, 111, "Failed to Retrieve Data", error);
        }
    }

    async getPayrollDataById(req: PayrollProcessedLogReq): Promise<CommonResponseModel> {
        try {
            const data = await this.payrollProcessedLogRepository.getPayrollDataById(req);
            const records = Array.isArray(data) ? data : data.data || [];
            const payrollComponents = await this.payrollComponentsService.getAllPayrollComponents()
            const componentsData = payrollComponents.data || [];
            const finalResult = await Promise.all(
                records.map(async (record) => {
                    const componentKeys = [];
                    if (record.componentRecords) {
                        try {
                            const parsedComponents = JSON.parse(record.componentRecords);
                            for (const [key, value] of Object.entries(parsedComponents)) {
                                const component = componentsData.find((comp) => comp.componentName === key);
                                componentKeys.push({
                                    [key]: value,
                                    type: component?.componentType || 'unknown',
                                });
                            }
                        } catch {
                            console.error("Invalid JSON in componentRecords:", record.componentRecords);
                        }
                    }
                    return { ...record, componentKeys };
                })
            );
            // console.log(finalResult[0].componentKeys, '')
            const response = finalResult.length > 0
                ? new CommonResponseModel(true, 1, 'Data retrieved', finalResult)
                : new CommonResponseModel(false, 0, 'No Data', []);

            return response;
        } catch (error) {
            console.error('Error fetching payroll data:', error);
            return new CommonResponseModel(false, 0, 'An error occurred', error);
        }
    }

    async getPayrollProcessLogReport(req?: any): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollProcessedLogRepository.getPayrollProcessedLogRepoData()
            const dynamicColumns = Array.isArray(result) ? result : result.data || [];
            const ogResult = dynamicColumns.map((record: any) => {
                if (record.componentRecords) {
                    try {
                        const parsedComponents = JSON.parse(record.componentRecords);
                        const componentKeys = Object.entries(parsedComponents).map(([key, value]) => ({
                            [key]: value,
                        }));
                        return { ...record, componentKeys, };
                    } catch (error) {
                        console.error("Invalid JSON in componentRecords:", record.componentRecords, error);
                        return { ...record, componentKeys: [], };
                    }
                }
                return { ...record, componentKeys: [], };
            });

            console.log(ogResult, "ogResult");

            if (ogResult) {
                return new CommonResponseModel(true, 1, "Data Retrived", ogResult)
            } else {
                return new CommonResponseModel(false, 0, "Failed")
            }
        } catch (err) {
            return new CommonResponseModel(false, 111, "Failed to Retrieve Data", err);
        }
    }

    // async payrollStatusticsWhatsApi(status?: boolean, zone?: string) {
    //     try {
    //         const now = new Date();
    //         const year = now.getFullYear();
    //         const month = String(now.getMonth() + 1).padStart(2, '0');
    //         const date = String(now.getDate()).padStart(2, '0');
    //         const hours = String(now.getHours()).padStart(2, '0');
    //         const minutes = String(now.getMinutes()).padStart(2, '0');
    //         const seconds = String(now.getSeconds()).padStart(2, '0');
    //         const textReport = `*Generated on* : ${date}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    //         const branchWiseEmpData = await this.payrollProcessedLogRepository.getBranchWiseEmpData();
    //         console.log(branchWiseEmpData, "branchWiseEmpData");
    //         const getPayrollProcessLog = await this.getPayrollProcessLogReport();
    //         const getPayrollProcessLogData = getPayrollProcessLog.data;
    //         console.log(getPayrollProcessLogData, "getPayrollProcessLogData");
    //         const branchAlerts: Record<string, string[]> = branchWiseEmpData.reduce((acc, emp) => {
    //             if (!acc[emp.branchName]) {
    //                 acc[emp.branchName] = [];
    //             }
    //             acc[emp.branchName].push(emp.empId.toString());
    //             return acc;
    //         }, {});
    //         const phoneNumbers = [6281481725];
    //         for (const [branchName, empIds] of Object.entries(branchAlerts)) {
    //             let branchReport = `${textReport}\\n\\n`;
    //             branchReport += `*Branch Name*: ${branchName}`;
    //             console.log(empIds,"empIds")
    //             let totalEarningsSum = 0;
    //             let totalDeductionsSum = 0;
    //             let totalNetPayableSum = 0;
    //             let totalPFSum = 0;
    //             let totalEsiSum = 0;

    //             for (const empId of empIds) {
    //                 const employeeData = getPayrollProcessLogData.find(
    //                     (record) => record.employeeId.toString() === empId
    //                 );
    //                 if (employeeData && employeeData.componentKeys) {
    //                     const totalEarnings = employeeData.componentKeys.find((item: any) => item["Total Earnings"]);
    //                     const totalDeductions = employeeData.componentKeys.find((item: any) => item["Total Deductions"]);
    //                     const totalNetPayable = employeeData.componentKeys.find((item: any) => item["Net Payable"]);
    //                     const totalPF = employeeData.componentKeys.find((item: any) => item["PF"]);
    //                     const totalEsi = employeeData.componentKeys.find((item: any) => item["ESI"]);

    //                     if (totalEarnings && totalDeductions && totalNetPayable && totalPF && totalEsi) {
    //                         totalEarningsSum += parseFloat(totalEarnings["Total Earnings"]);
    //                         totalDeductionsSum += parseFloat(totalDeductions["Total Deductions"]);
    //                         totalNetPayableSum += parseFloat(totalNetPayable["Net Payable"]);
    //                         totalPFSum += parseFloat(totalPF["PF"]);
    //                         totalEsiSum += parseFloat(totalEsi["ESI"]);
    //                     }
    //                 }
    //             }
    //             const totalCTCSum = totalEarningsSum + totalPFSum + totalEsiSum;
    //             branchReport += `\\n\\n*Total Earnings*: ${totalEarningsSum.toFixed(2)}`;
    //             branchReport += `\\n\\n*Total Deductions*: ${totalDeductionsSum.toFixed(2)}`;
    //             branchReport += `\\n\\n*Net Payable*: ${totalNetPayableSum.toFixed(2)}`;
    //             branchReport += `\\n\\n*CTC*: ${totalCTCSum.toFixed(2)}`;

    //             for (const phoneNumber of phoneNumbers) {
    //                 await this.whatsService.aabsentLeaveStatusWhatsappApi(phoneNumber, branchReport, 'payroll_statustics');
    //             }
    //         }

    //         return new CommonResponseModel(true, 1, 'MessageSended');
    //     } catch (error) {
    //         console.error('Error sending bot alert:', error);
    //     }
    // }

    async payrollStatusticsWhatsApi(status?: boolean, zone?: string) {
        try {
            const now = new Date();
            let month = now.getMonth() + 1;
            const year = now.getFullYear();
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0')
            let previousMonth = month - 1;
            let previousYear = year;
            if (previousMonth === 0) {
                previousMonth = 12;
                previousYear -= 1;
            }
            const previousMonthStr = `${previousYear}${String(previousMonth).padStart(2, '0')}`;
            let beforePreviousMonth = previousMonth - 1;
            let beforePreviousYear = previousYear;
            if (beforePreviousMonth === 0) {
                beforePreviousMonth = 12;
                beforePreviousYear -= 1;
            }
            const beforePreviousMonthStr = `${beforePreviousYear}${String(beforePreviousMonth).padStart(2, '0')}`;
            const branchWiseEmpData = await this.payrollProcessedLogRepository.getBranchWiseEmpData();
            const getPayrollProcessLog = await this.getPayrollProcessLogReport();
            const getPayrollProcessLogData = getPayrollProcessLog.data;

            const filteredDataPrevMonth = getPayrollProcessLogData.filter(
                (record) => record.payrollMonth.toString() === previousMonthStr
            );
            const filteredDataCurrentMonth = getPayrollProcessLogData.filter(
                (record) => record.payrollMonth.toString() === beforePreviousMonthStr
            );
            const branchAlerts: Record<string, string[]> = branchWiseEmpData.reduce((acc, emp) => {
                if (!acc[emp.branchName]) {
                    acc[emp.branchName] = [];
                }
                acc[emp.branchName].push(emp.empId.toString());
                return acc;
            }, {});

            const phoneNumbers = [6281481725];
            for (const [branchName, empIds] of Object.entries(branchAlerts)) {
                let headCountLastMonth = 0;
                let headCountCurrentMonth = 0;
                let totalEarningsSum = 0;
                let totalDeductionsSum = 0;
                let totalNetPayableSum = 0;
                let totalPFSum = 0;
                let totalEsiSum = 0;
                for (const empId of empIds) {
                    const employeeDataPrevMonth = filteredDataPrevMonth.find(
                        (record) => record.employeeId.toString() === empId
                    );
                    if (employeeDataPrevMonth) {
                        headCountLastMonth += 1;
                    }
                    const employeeDataCurrentMonth = filteredDataCurrentMonth.find(
                        (record) => record.employeeId.toString() === empId
                    );
                    if (employeeDataCurrentMonth) {
                        headCountCurrentMonth += 1;
                    }
                    const employeeData = filteredDataPrevMonth.find(
                        (record) => record.employeeId.toString() === empId
                    );
                    if (employeeData && employeeData.componentKeys) {
                        const totalEarnings = employeeData.componentKeys.find((item: any) => item["Total Earnings"]);
                        const totalDeductions = employeeData.componentKeys.find((item: any) => item["Total Deductions"]);
                        const totalNetPayable = employeeData.componentKeys.find((item: any) => item["Net Payable"]);
                        const totalPF = employeeData.componentKeys.find((item: any) => item["PF"]);
                        const totalEsi = employeeData.componentKeys.find((item: any) => item["ESI"]);

                        if (totalEarnings && totalDeductions && totalNetPayable && totalPF && totalEsi) {
                            totalEarningsSum += parseFloat(totalEarnings["Total Earnings"]);
                            totalDeductionsSum += parseFloat(totalDeductions["Total Deductions"]);
                            totalNetPayableSum += parseFloat(totalNetPayable["Net Payable"]);
                            totalPFSum += parseFloat(totalPF["PF"]);
                            totalEsiSum += parseFloat(totalEsi["ESI"]);
                        }
                    }
                }
                const totalCTCSum = totalEarningsSum + totalPFSum + totalEsiSum;
                let branchReport = `*Generated on* : ${date}-${month}-${year} ${hours}:${minutes}:${seconds}`;
                branchReport = `\\n\\n*Branch Name* :${branchName}`;
                branchReport += `\\n\\n*Total Earnings*: ${totalEarningsSum.toFixed(2)}`;
                branchReport += `\\n\\n*Total Deductions*: ${totalDeductionsSum.toFixed(2)}`;
                branchReport += `\\n\\n*Net Payable*: ${totalNetPayableSum.toFixed(2)}`;
                branchReport += `\\n\\n*CTC*: ${totalCTCSum.toFixed(2)}`;
                branchReport += `\\n\\n*Head Count This Month*: ${headCountLastMonth}`;
                branchReport += `\\n\\n*Head Count Last Month*: ${headCountCurrentMonth}`;
                for (const phoneNumber of phoneNumbers) {
                    await this.whatsService.aabsentLeaveStatusWhatsappApi(
                        phoneNumber,
                        branchReport,
                        'payroll_statustics'
                    );
                }
            }

            return new CommonResponseModel(true, 1, 'Message Sent');
        } catch (error) {
            return new CommonResponseModel(false, 111, "Failed to Retrieve Data", error);
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

    async getPayrollHeadCountReportData(req: any): Promise<CommonResponseModel> {
        try {
            console.log(req, "Request Data");
            const { payrollMonth, branchId } = req;
            console.log(payrollMonth, "Current Month");
            const year = payrollMonth.slice(0, 4);
            let month = payrollMonth.slice(4, 6);
            let previousYear = year;
            let previousMonth = String(Number(month) - 1).padStart(2, '0');
            if (month === "01") {
                previousMonth = "12";
                previousYear = String(Number(year) - 1);
            }
            const formattedPerviousMonth = `${previousYear}${previousMonth}`;
            console.log(formattedPerviousMonth, "Previous Month");

            const newReq = {
                ...req,
                payrollMonths: [payrollMonth, formattedPerviousMonth],
            };
            const allData = [];
            for (const month of newReq.payrollMonths) {
                const monthData = await this.payrollProcessedLogRepository.getPayrollHeadCountReportDataRepo({
                    branchId,
                    payrollMonth: month
                });
                allData.push(...monthData);
            }
            const dynamicColumns = Array.isArray(allData) ? allData : allData || [];
            const finalResult = dynamicColumns.map((record: any) => {
                if (record.componentRecords) {
                    try {
                        const parsedComponents = JSON.parse(record.componentRecords);
                        const componentKeys = Object.entries(parsedComponents).map(([key, value]) => ({ [key]: value }));
                        return { ...record, componentKeys };
                    } catch (error) {
                        console.error("Error parsing componentRecords:", error);
                        return { ...record, componentKeys: [] };
                    }
                }
                return { ...record, componentKeys: [] };
            })
            // console.log(finalResult, "finalResult")
            const monthNames = {
                "01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June",
                "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December",
            }
            const getMonthName = (month: string | number) => {
                const monthStr = month.toString();
                const year = monthStr.slice(0, 4);
                const monthPart = monthStr.slice(4, 6);
                return `${monthNames[monthPart]} ${year}`;
            }
            const groupedData = finalResult.reduce((acc: any, record: any) => {
                const month = record.payrollMonth;
                if (!acc[month]) {
                    acc[month] = {
                        headCount: 0,
                        grossTotal: 0,
                        netSalary: 0,
                        ctcTotal: 0,
                        monthName: getMonthName(month)
                    };
                }
                acc[month].headCount += 1;

                const grossComponent = record.componentKeys.find((component: any) => component["Gross"]);
                if (grossComponent) {
                    acc[month].grossTotal += parseFloat(grossComponent["Gross"]);
                }

                const netPaySalary = record.componentKeys.find((component: any) => component["Net Payable"]);
                if (netPaySalary) {
                    acc[month].netSalary += parseFloat(netPaySalary["Net Payable"]);
                }
                const totalEarningsComponents = record.componentKeys.find((component: any) => component["Total Earnings"]);
                const pfComponent = record.componentKeys.find((component: any) => component["PF"]);
                const esiComponent = record.componentKeys.find((component: any) => component["ESI"]);
                const totalEarnings = totalEarningsComponents ? parseFloat(totalEarningsComponents["Total Earnings"]) : 0;
                const pf = pfComponent ? parseFloat(pfComponent["PF"]) : 0;
                const esi = esiComponent ? parseFloat(esiComponent["ESI"]) : 0;
                acc[month].ctcTotal += totalEarnings + pf + esi;

                return acc;
            }, {});

            console.log(groupedData, "Grouped Data");
            const empData = await this.payrollProcessedLogRepository.getEmpDOBandDORDataRepo(req);
            console.log(req, "rrrrr");
            const filteredDataFromEmpData = empData.filter((record) =>
                (record.branchId === req.branchId && record.dateOfJoining === req.payrollMonth)

            );
            console.log(filteredDataFromEmpData, "filteredDataFromEmpData");
            const empAdditionsCount = filteredDataFromEmpData.filter(
                (record) => record.dateOfJoining === req.payrollMonth
            ).length
            const empDeletionsCount = filteredDataFromEmpData.filter(
                (record) => record.dateOfReliving === req.payrollMonth
            ).length
            let additionOfGrossFromEmp = 0
            let additionOfNetPayableFromEmp = 0
            let deletionOfGrossFromEmp = 0
            let deletionOfNetPayableFromEmp = 0
            for (const empRecord of filteredDataFromEmpData) {
                const matchingAdditionData = finalResult.filter((payrollRecord: any) => {
                    return payrollRecord.employeeId === empRecord.id && payrollRecord.branchId === empRecord.branchId && payrollRecord.payrollMonth === Number(empRecord.dateOfJoining);
                })
                if (matchingAdditionData.length > 0) {
                    matchingAdditionData.forEach((payrollRecord: any) => {
                        const grossComponent = payrollRecord.componentKeys.find((component: any) => component["Gross"]);
                        if (grossComponent) {
                            additionOfGrossFromEmp += parseFloat(grossComponent["Gross"]);
                        }
                        const netPayableComponent = payrollRecord.componentKeys.find((component: any) => component["Net Payable"]);
                        if (netPayableComponent) {
                            additionOfNetPayableFromEmp += parseFloat(netPayableComponent["Net Payable"]);
                        }
                    });
                }

                const matchingDeletionData = finalResult.filter((payrollRecord: any) => {
                    return payrollRecord.employeeId === empRecord.id && payrollRecord.branchId === empRecord.branchId && payrollRecord.payrollMonth === Number(empRecord.dateOfReliving);
                })
                if (matchingDeletionData.length > 0) {
                    matchingDeletionData.forEach((payrollRecord: any) => {
                        const grossComponent = payrollRecord.componentKeys.find((component: any) => component["Gross"]);
                        if (grossComponent) {
                            deletionOfGrossFromEmp += parseFloat(grossComponent["Gross"]);
                        }
                        const netPayableComponent = payrollRecord.componentKeys.find((component: any) => component["Net Payable"]);
                        if (netPayableComponent) {
                            deletionOfNetPayableFromEmp += parseFloat(netPayableComponent["Net Payable"]);
                        }
                    });
                }
            }
            console.log(additionOfGrossFromEmp, "additionOfGrossFromEmp")
            console.log(additionOfNetPayableFromEmp, "additionOfNetPayableFromEmp")
            console.log(deletionOfGrossFromEmp, "deletionOfGrossFromEmp")
            console.log(deletionOfNetPayableFromEmp, "deletionOfNetPayableFromEmp")
            let empAddDelData;
            empAddDelData = {
                additionsData: { empAdditionsCount, additionOfGrossFromEmp, additionOfNetPayableFromEmp },
                deletionsData: { empDeletionsCount, deletionOfGrossFromEmp, deletionOfNetPayableFromEmp }
            }
            console.log(empAddDelData, "empAddDelData")
            return new CommonResponseModel(true, 1, "Data Retrieved Successfully", groupedData, empAddDelData);
        } catch (err) {
            console.error("Error in fetching payroll data:", err);
            return new CommonResponseModel(false, 0, "Failed to Retrieve Data");
        }
    }

    async getBankRecompilationData(req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollProcessedLogRepository.getBankReconciliationReportRepo(req)
            if (result.length > 0) {
                return new CommonResponseModel(true, 111, "Data Retrieved Successfully", result)
            } else {
                return new CommonResponseModel(true, 111, "Failed to Retrieve Data")
            }

        } catch (err) {
            return new CommonResponseModel(false, 111, "Failed to Retrieve Data", err);
        }
    }

    async getCashRecompilationData(req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollProcessedLogRepository.getCashReconciliationReportRepo(req)
            if (result.length > 0) {
                return new CommonResponseModel(true, 111, "Data Retrieved Successfully", result)
            } else {
                return new CommonResponseModel(true, 111, "Failed to Retrieve Data")
            }

        } catch (err) {
            return new CommonResponseModel(false, 111, "Failed to Retrieve Data", err);
        }
    }

    async getEmployeesDataByBank(req: any): Promise<CommonResponseModel> {
        console.log(req, 'service-req')
        try {
            const result = await this.payrollProcessedLogRepository.getEmployeesDataByBank(req);

            if (result && result.status && Array.isArray(result.data) && result.data.length > 0) {
                return new CommonResponseModel(true, 111, "Data Retrieved Successfully", result.data);
            }

            return new CommonResponseModel(false, 111, "Failed to Retrieve Data");
        } catch (err) {
            // Add meaningful error message if needed
            return new CommonResponseModel(false, 111, "Failed to Retrieve Data", err);
        }
    }

    async getAllPayrollHeadWiseReport(req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollProcessedLogRepository.getPayrollHeadWiseRepo(req);
            if (result) {
                return new CommonResponseModel(true, 111, "Data Retrieved Successfully", result);
            }
            return new CommonResponseModel(false, 111, "Failed to Retrieve Data");
        } catch (err) {
            throw new Error(`Not Details Found`);
        }
    }

    async getPayrollProcessedLogForHodApproval(req: PayrollProcessedLogReq): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollProcessedLogRepository.getPayrollProcessedLogForHodApproval(req)
            const dynamicColumns = Array.isArray(result) ? result : result.data || [];
            const finalResult = dynamicColumns.map((record: any) => {
                if (record.componentRecords) {
                    try {
                        const parsedComponents = JSON.parse(record.componentRecords);
                        const componentKeys = Object.entries(parsedComponents).map(([key, value]) => ({
                            [key]: value,
                        }));
                        return { ...record, componentKeys, };
                    } catch (error) {
                        console.error("Invalid JSON in componentRecords:", record.componentRecords, error);
                        return { ...record, componentKeys: [], };
                    }
                }
                return { ...record, componentKeys: [], };
            });

            // console.log(finalResult, "finalResult");

            if (finalResult) {
                return new CommonResponseModel(true, 1, "Data Retrived", finalResult)
            } else {
                return new CommonResponseModel(false, 0, "Failed")
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, 'failed', err)
        }
    }

    async updatePayrollHoldAndReleaseStatus(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.payrollProcessedLogRepository.update({ employeeId: In(req.employeeId), payrollMonth: req.payrollMonth }, { holdStatus: req.holdStatus })
            if (data) {
                return new CommonResponseModel(true, 1, 'Data retrieved', data)
            } else {
                return new CommonResponseModel(false, 0, 'No Data', [])
            }
        } catch (error) {
            return new CommonResponseModel(false, 111, "Failed", error);
        }
    }

    async getPayrollMisReportEmployee(req?: any): Promise<CommonResponseModel> {
        try {
            const data = await this.payrollProcessedLogRepository.getPayrollMisReportEmployeeRepo(req);
            if (data && data.length) {
                const result = data.reduce((recData, reqData) => {
                    const components = JSON.parse(reqData.componentRecords || '{}');
                    const key = `${reqData.payrollMonth}-${reqData.branchId}`;
                    if (!recData[key]) {
                        recData[key] = {
                            payrollMonth: reqData.payrollMonth,
                            branchId: reqData.branchId,
                            payMode: reqData.payMode,
                            employeeCount: 0,
                            totalGross: 0,
                            totalEarnings: 0,
                            totalDeductions: 0,
                            totalNetPayable: 0,
                            totalCTC: 0,
                            totalTDS: 0,
                            totalPF: 0,
                            totalESI: 0,
                            branchName: reqData.branchName,
                            bankCount: 0,
                            cashCount: 0,
                        };
                    }
                    recData[key].employeeCount++;
                    recData[key].totalGross += Number(components.Gross) || 0
                    recData[key].totalEarnings += Number(components["Total Earnings"]) || 0
                    recData[key].totalDeductions += Number(components["Total Deductions"]) || 0;
                    recData[key].totalNetPayable += Number(components["Net Payable"]) || 0
                    recData[key].totalCTC += Number(components.CTC) || 0
                    recData[key].totalTDS += Number(components.TDS) || 0
                    recData[key].totalPF += Number(components["PF-Employee"] || 0) + Number(components["PF-Employer"]) || 0
                    recData[key].totalESI += Number(components["ESI-Employee"] || 0) + Number(components["ESI-Employer"]) || 0;
                    if (reqData.payMode === 'Bank') {
                        recData[key].bankCount++;
                    } else if (reqData.payMode === 'Cash') {
                        recData[key].cashCount++;
                    }
                    return recData;
                }, {});
                const finalResult = Object.values(result);
                return new CommonResponseModel(true, 1, 'Data retrieved', finalResult);
            } else {
                return new CommonResponseModel(false, 0, 'No Data', []);
            }
        } catch (error) {
            console.error("Error in getPayrollMisReport:", error);
            return new CommonResponseModel(false, 111, "Failed", error);
        }
    }

    async getPayrollMisReportWorker(req?: any): Promise<CommonResponseModel> {
        try {
            const data = await this.payrollProcessedLogRepository.getPayrollMisReportWorkerRepo(req);
            if (data && data.length) {
                const result = data.reduce((recData, reqData) => {
                    const components = JSON.parse(reqData.componentRecords || '{}');
                    const key = `${reqData.payrollMonth}-${reqData.branchId}`;
                    if (!recData[key]) {
                        recData[key] = {
                            payrollMonth: reqData.payrollMonth,
                            branchId: reqData.branchId,
                            payMode: reqData.payMode,
                            employeeCount: 0,
                            totalGross: 0,
                            totalEarnings: 0,
                            totalDeductions: 0,
                            totalNetPayable: 0,
                            totalCTC: 0,
                            totalTDS: 0,
                            totalPF: 0,
                            totalESI: 0,
                            branchName: reqData.branchName,
                            bankCount: 0,
                            cashCount: 0,
                        };
                    }
                    recData[key].employeeCount++;
                    recData[key].totalGross += Number(components.Gross) || 0
                    recData[key].totalEarnings += Number(components["Total Earnings"]) || 0
                    recData[key].totalDeductions += Number(components["Total Deductions"]) || 0;
                    recData[key].totalNetPayable += Number(components["Net Payable"]) || 0
                    recData[key].totalCTC += Number(components.CTC) || 0
                    recData[key].totalTDS += Number(components.TDS) || 0
                    recData[key].totalPF += Number(components["PF-Employee"] || 0) + Number(components["PF-Employer"]) || 0
                    recData[key].totalESI += Number(components["ESI-Employee"] || 0) + Number(components["ESI-Employer"]) || 0;
                    if (reqData.payMode === 'Bank') {
                        recData[key].bankCount++;
                    } else if (reqData.payMode === 'Cash') {
                        recData[key].cashCount++;
                    }
                    return recData;
                }, {});
                const finalResult = Object.values(result);
                return new CommonResponseModel(true, 1, 'Data retrieved', finalResult);
            } else {
                return new CommonResponseModel(false, 0, 'No Data', []);
            }
        } catch (error) {
            console.error("Error in getPayrollMisReport:", error);
            return new CommonResponseModel(false, 111, "Failed", error);
        }
    }

    async getPayrollEsiReport(req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.payrollProcessedLogRepository.getPayrollEsiReportRepo(req);
            if (result) {
                return new CommonResponseModel(true, 111, "Data Retrieved Successfully", result);
            }
            return new CommonResponseModel(false, 111, "Failed to Retrieve Data");
        } catch (err) {
            throw new Error(`Not Details Found`);
        }
    }

}