import { EmailModel } from '@hrexpert/shared-models';
import React from 'react';
import { message } from 'antd'; 
import { PayrollMailService } from '@hrexpert/shared-services';

const MailTemplate = ({ mailData, monthData, yearData, typeData }) => {
    const service = new PayrollMailService()
    const getMonthName = (val) =>{
        console.log(val,'====')
    }
    let mailerSent = false;

    async function sendMailForApprovalUser() {
        if (!mailData || mailData.length === 0) {
            message.warning('No mail data available to send emails.');
            return;
        }

        const monthName = getMonthName(monthData);
        const promises = mailData.map(async (item) => {
            try {
                const employeeDetails = new EmailModel();
                employeeDetails.employeeCode = item.employeeCode;
                employeeDetails.to = item.emailId;
                employeeDetails.subject = `Your Payslip for ${monthName}, ${yearData}`;
                employeeDetails.html = `
                    <html>
                    <head>
                      <meta charset="UTF-8" />
                      <style>
                        #acceptDcLink {
                              display: inline-block;
                              padding: 10px 20px;
                              background-color: #28a745;
                              color: #fff;
                              text-decoration: none;
                              border-radius: 5px;
                              margin-top: 10px;
                              transition: background-color 0.3s ease, color 0.3s ease;
                              cursor: pointer;
                          }
                  
                          #acceptDcLink.accepted {
                              background-color: #6c757d;
                              cursor: not-allowed;
                          }
                  
                          #acceptDcLink:hover {
                              background-color: #218838;
                              color: #fff;
                          }
                      </style>
                    </head>
                    <body>
                      <p>Dear ${item.employeeName},</p>
                      <p>We are pleased to inform you that your payslip for the month of ${monthName}, ${yearData} is now available.</p>
                      <p>To view and download your payslip, please click on the link below:</p>
                      <a
                      href="${window.location.origin}/#/payslip-print/${typeData}/${monthData}/${yearData}/${item.employeeId}"
                      style="
                      display: inline-block;
                      padding: 10px 20px;
                      background-color: #007bff;
                      color: #fff;
                      text-decoration: none;
                      border-radius: 5px;
                      "
                      >View Your Payslip</a>
                      
                      <p>If you have any concerns regarding your payslip, feel free to reach out to the HR department at [HR Contact Email/Phone Number].</p>
                    </body>
                  </html>
                `;

                return await service.sendPaySlipMail();
            } catch (error) {
                console.error(`Error sending mail to ${item.emailId}:`, error);
                throw error;
            }
        });

        try {
            const results = await Promise.all(promises);
            results.forEach((res, index) => {
                if (res.status === 201) {
                    if (res.data.status) {
                        message.success(`Mail sent successfully to ${mailData[index]?.emailId}`);
                    } else {
                        message.warning(`Mail sent but with issues to ${mailData[index]?.emailId}`);
                    }
                } else {
                    message.error(`Failed to send mail to ${mailData[index]?.emailId}`);
                }
            });
            mailerSent = true;
        } catch (error) {
            message.error('Failed to send some emails. Check logs for details.');
        }
    }

    return (
        <div>
            <h2>Mail Template</h2>
            <button onClick={sendMailForApprovalUser} disabled={mailerSent}>
                {mailerSent ? 'Mails Sent' : 'Send Mails'}
            </button>
        </div>
    );
};

export default MailTemplate;