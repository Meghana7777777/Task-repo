import {ComponentTypeEnum,PayrollProcessedLogReq} from '@hrexpert/shared-models';
import { PayrollProcessedLogsService } from '@hrexpert/shared-services';
import {Document,Font,Image,Page,StyleSheet,Text,View } from '@react-pdf/renderer';
import { amountToWords } from 'amount-to-words';
import { message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import logo from './sakku-logo.png';
import robotoFont from './Roboto-Regular.ttf'

Font.register({
    family: 'Roboto',
    src: robotoFont,
  });
  

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Roboto'
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#B0E0E6',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #000',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    width: 100,
    height: 'auto',
  },
  subHeader: {
    textAlign: 'center',
    margin: '10px 0',
  },
  employeeInfo: {
    flexDirection: 'row',
    marginBottom: 5,
    padding: '0 10px',
  },
  col16: {
    width: '66.67%',
    lineHeight: '15px',
  },
  col8: {
    width: '33.33%',
    textAlign: 'right',
    justifyContent: 'center',
  },
  col16Child: {
    width: '50%',
    lineHeight: '15px',
  },
  col8Child: {
    width: '50%',
    textAlign: 'left',
    justifyContent: 'center',
  },
  netPayable: {
    color: '#52c41a',
    fontSize: 22,
  },
  divider: {
    borderBottom: 1,
    borderColor: '#000',
    margin: '5px 0',
  },
  accountInfo: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  table: {
    marginTop: 10,
    border: '1px solid #000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e6f7ff',
    textAlign: 'center',
    borderBottom: '1px solid #000',
  },
  tableCell: {
    padding: 5,
    borderBottom: '1px solid #000',
    borderRight: '1px solid #000',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f5ff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#fafafa',
    textAlign: 'center',
    lineHeight: '20px',
  },
});

export interface PaySlipProps {
  employeePdfData: any[]
  earningsData: any[]
  deductionsData: any[]
  totalEarnings: string
  totalDeductions: string
  netPayable: string
  wordAmount: string
}

const PayslipPDF = (props: PaySlipProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {props.employeePdfData?.map((employee, index) => (
          <View key={index}>
            <View style={styles.header}>
              <Text style={styles.title}>Venkatrama Poultries Pvt. Ltd.</Text>
              <Image style={styles.logo} src={logo} />
            </View>

            <Text style={styles.subHeader}>
              Payslip for {employee.monthYear}
            </Text>

            <View style={styles.employeeInfo}>
              <View style={styles.col16}>
                <Text>
                  {employee.empName}, {employee.empCode}
                </Text>
                <Text style={{ color: '#666' }}>
                  {employee.designation} | {employee.department}
                </Text>
                <Text style={{ color: '#666' }}>
                  Date of Joining: {dayjs(employee.doj).format('YYYY-MM-DD')}
                </Text>
              </View>
              <View style={styles.col8}>
                <Text style={styles.netPayable}>{props.netPayable}</Text>
                <Text style={{ color: '#666' }}>
                  Paid Days: {employee.payDays} | LOP Days:{' '}
                  {employee.lopDays || 0}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.accountInfo}>
              <View style={styles.col16}>
                <Text>PF A/C No: {employee.pfNo}</Text>
                <Text>PAN: {employee.pan}</Text>
                <Text>Bank A/c No: {employee.bankAccNo}</Text>
              </View>
              <View style={styles.col8Child}>
                <Text>UAN: {employee.uan}</Text>
                <Text>ESI : {employee.esicNo}</Text>
                <Text>Branch: {employee.branch}</Text>
              </View>
            </View>

            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, { width: '25%' }]}>
                  EARNINGS
                </Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>AMOUNT</Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>
                  DEDUCTIONS
                </Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>AMOUNT</Text>
              </View>

              {Array.from({
                length: Math.max(props.earningsData.length, props.deductionsData.length),
              }).map((_, i) => (
                <View style={styles.tableRow} key={i}>
                  <Text style={[styles.tableCell, { width: '25%' }]}>
                    {props.earningsData[i]?.item || ''}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: '25%', textAlign: 'right' },
                    ]}
                  >
                    {props.earningsData[i]?.amount || ''}
                  </Text>
                  <Text style={[styles.tableCell, { width: '25%' }]}>
                    {props.deductionsData[i]?.item || ''}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: '25%', textAlign: 'right' },
                    ]}
                  >
                    {props.deductionsData[i]?.amount || ''}
                  </Text>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={[styles.tableCell, { width: '25%' }]}>
                  Total Earnings
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { width: '25%', textAlign: 'right' },
                  ]}
                >
                  {props.totalEarnings}
                </Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>
                  Total Deductions
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { width: '25%', textAlign: 'right' },
                  ]}
                >
                  {props.totalDeductions}
                </Text>
              </View>
            </View>

            <View style={{ ...styles.footer, padding: 5, backgroundColor: '#fafafa' }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5, textAlign:'left' }}>
                    Total Net Payable: {props.netPayable}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>In Words: {props.wordAmount}</Text>
                    <Text style={{ fontWeight: 'bold' }}>Signature</Text>
                </View>
                <Text style={{ fontSize: 10, color: '#666' }}>
                    -- This is a system-generated document. --
                </Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default PayslipPDF;
