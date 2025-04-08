import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import robotoFont from '../../../payroll-management/payslip/Roboto-Regular.ttf';
import sakkuLogo from './sakku-logo.png';

Font.register({
  family: 'Roboto',
  src: robotoFont,
});


const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 'auto',
  },
  title: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  box: {
    border: '1px solid black',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    alignContent: 'flex-start'
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  inputLine: {
    flex: 2,
    borderBottom: '1px solid black',
    alignContent: 'flex-start',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    border: '1px solid black',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
    textAlign: 'center',
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  noBorderBottom: {
    borderBottom: 'none',
  },
  tableNoBorderBottom: {
    borderBottom: 'none',
  },
  boldText: {
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    textAlign: 'left',
    // borderBottom: '1px solid black',
  },
  signatureSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  signatureBox: {
    textAlign: 'center',
    flex: 1,
    margin: 5,
  },
  accountsSection: {
    marginTop: 20,
    borderTop: '1px solid black',
    paddingTop: 10,
  },
  remarksBox: {
    height: 50,
    marginTop: 10,
  },
});
interface TourClaimPdfProps {
  submittedData: any
  fareDetailsTotalAmount: number
  taDaDetailsTotalAmount: number
  LocalConvyTotalAmount: number
  otherExpensesTotalAmount: number
  balanceTotalAmount: number
  pdfData: any
}


const TourExpensesClaimForm = (props: TourClaimPdfProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={sakkuLogo} />
        </View>
        {/* Title */}
        <Text style={styles.title}>TOUR EXPENSES CLAIM FORM</Text>

        {/* Employee Details Section */}
        <View style={[styles.box, styles.section]}>
          <View style={styles.row}>
            <Text style={styles.label}>Employee No : {props.submittedData?.employeeCode}</Text>
            <Text style={styles.label}>Name : {props.submittedData?.employeeName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Department : {props.submittedData?.department}</Text>
            <Text style={styles.label}>Designation : {props.submittedData?.designation}</Text>
          </View>
        </View>

        {/* Tour Period */}
        <View style={[styles.section, { marginBottom: 5, marginTop: 10 }]}>
          <Text>Tour Period (Date, Time):</Text>
          <View style={styles.row}>
            <Text>From:</Text>
            <Text style={styles.inputLine}>{props.submittedData?.tourPeriodFromDate}</Text>
            <Text>To:</Text>
            <Text style={styles.inputLine}>{props.submittedData?.tourPeriodToDate}</Text>
          </View>
        </View>

        {/* Fare Details Table */}
        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>I. Fare Details:</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>From Place / Date / Time</Text>
            <Text style={styles.tableCell}>To Place / Date / Time</Text>
            <Text style={styles.tableCell}>Mode of Transport</Text>
            <Text style={styles.tableCell}>Fares Rs.</Text>
          </View>
          {Array.from({ length: props.submittedData?.fareDetails.length }).map((_, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableCell}>{props.submittedData?.fareDetails[idx]?.fareDetailsFromPlace}-{dayjs(props.submittedData?.fareDetails[idx]?.fareDetailsfromDate).format('YYYY-MM-DD')}</Text>
              <Text style={styles.tableCell}>{props.submittedData?.fareDetails[idx]?.fareDetailstoPlace}-{dayjs(props.submittedData?.fareDetails[idx]?.fareDetailstoDate).format('YYYY-MM-DD')}</Text>
              <Text style={styles.tableCell}>{props.submittedData?.fareDetails[idx]?.fareDetailstransport}</Text>
              <Text style={styles.tableCell}>{props.submittedData?.fareDetails[idx]?.fareDetailsAmount}</Text>
            </View>
          ))}
          <View style={[styles.tableRow, styles.noBorderBottom]}>
            <Text style={[styles.tableCell, { flex: 3.18, textAlign: 'right' }]}>TOTAL:</Text>
            <Text style={styles.tableCell}>{props.fareDetailsTotalAmount + ' /-'}</Text>
          </View>
        </View>

        {/* TA/DA Details Table */}
        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>II. TA/DA Details (Bills to be enclosed):</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Lodging Details</Text>
            <Text style={styles.tableCell}>Food Expenses</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>
          {Array.from({ length: props.submittedData?.taDaDetails.length }).map((_, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableCell}>{dayjs(props.submittedData?.taDaDetails[idx]?.taDaDetailsDate).format('YYYY-MM-DD')}</Text>
              <Text style={styles.tableCell}> {props.submittedData?.taDaDetails[idx]?.taDaDetailsDetails}</Text>
              <Text style={styles.tableCell}>{props.submittedData?.taDaDetails[idx]?.taDaDetailsFoodExpenses}</Text>
              <Text style={styles.tableCell}>{props.submittedData?.taDaDetails[idx]?.taDaDetailsAmount}</Text>
            </View>
          ))}
          <View style={[styles.tableRow, styles.noBorderBottom]}>
            <Text style={[styles.tableCell, { flex: 3.18, textAlign: 'right' }]}>TOTAL:</Text>
            <Text style={styles.tableCell}>{props.taDaDetailsTotalAmount + ' /-'}</Text>
          </View>
        </View>


        {/* Title for Local Conveyance & Other Expenses */}
        <Text style={[styles.boldText, { marginBottom: 10, marginTop: 10 }]}>
          III. Local Conveyance & Other Expenses:
        </Text>

        {/* Part A: Local Conveyance */}
        <Text style={[styles.boldText, { marginBottom: 5 }]}>
          Part - A :: Local Conveyance
        </Text>
        <View style={[styles.table, { marginBottom: 10 }]}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>From</Text>
            <Text style={styles.tableCell}>To</Text>
            <Text style={styles.tableCell}>Mode of Travel</Text>
            <Text style={styles.tableCell}>Amount (Rs.)</Text>
          </View>
          {Array.from({ length: props.submittedData?.localConvyDetails.length }).map((_, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableCell}>{dayjs(props.submittedData?.localConvyDetails[idx]?.localConvyDate).format('YYYY-MM-DD')}</Text>
              <Text style={styles.tableCell}>{props.submittedData?.localConvyDetails[idx]?.localConvyFromPlace}</Text>
              <Text style={styles.tableCell}>{props.submittedData?.localConvyDetails[idx]?.localConvyToPlace}</Text>
              <Text style={styles.tableCell}>{props.submittedData?.localConvyDetails[idx]?.localConvytourType}</Text>
              <Text style={styles.tableCell}>{props.submittedData?.localConvyDetails[idx]?.LocalConvyAmount}</Text>
            </View>
          ))}
          <View style={[styles.tableRow, styles.tableNoBorderBottom]}>
            <Text style={[styles.tableCell, { flex: 4.33, textAlign: 'right' }]}>TOTAL:</Text>
            <Text style={styles.tableCell}>{props.LocalConvyTotalAmount + ' /-'}</Text>
          </View>
        </View>

        {/* Part B: Other Expenses */}
        <Text style={[styles.boldText, { marginBottom: 5 }]}>
          Part-B :: Other Expenses
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Nature of Expenses</Text>
            <Text style={styles.tableCell}>Amount (Rs.)</Text>
          </View>
          {Array.from({ length: props.submittedData?.otherExpensesDetails.length }).map((_, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableCell}> {dayjs(props.submittedData?.otherExpensesDetails[idx]?.otherExpDate).format('YYYY-MM-DD')}</Text>
              <Text style={styles.tableCell}>{props.submittedData?.otherExpensesDetails[idx]?.otherExpNatureOfexp}</Text>
              <Text style={styles.tableCell}>{props.submittedData?.otherExpensesDetails[idx]?.otherExpAmount}</Text>
            </View>
          ))}
          <View style={[styles.tableRow, styles.tableNoBorderBottom]}>
            <Text style={[styles.tableCell, { flex: 2.06, textAlign: 'right' }]}>TOTAL:</Text>
            <Text style={styles.tableCell}>{props.otherExpensesTotalAmount + ' /-'}</Text>
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>

        {/* Total Expenses Section */}
        <View style={[styles.section, { marginTop: 10 }]}>
          <Text style={[styles.boldText, { marginBottom: 10 }]}>Total Expenses:</Text>
          <View style={styles.row}>
            <Text>1. Fares:</Text>
            <Text style={styles.inputLine}>{props.fareDetailsTotalAmount + ' /-'}</Text>
          </View>
          <View style={styles.row}>
            <Text>2. TA/DA:</Text>
            <Text style={styles.inputLine}>{props.taDaDetailsTotalAmount + ' /-'}</Text>
          </View>
          <View style={styles.row}>
            <Text>3. Conveyance & Other Expenses:</Text>
            <Text style={styles.inputLine}>{(props.LocalConvyTotalAmount + props.otherExpensesTotalAmount) + ' /-'}</Text>
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={[styles.boldText, { marginLeft: 10 }]}>GRAND TOTAL:</Text>
            <Text style={styles.inputLine}>{(props.fareDetailsTotalAmount + props.taDaDetailsTotalAmount + props.LocalConvyTotalAmount + props.otherExpensesTotalAmount) + ' /-'}</Text>
          </View>
        </View>

        {/* Signatures Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureBox}>Date:</Text>
          <Text style={styles.signatureBox}>Signature of the Employee</Text>
          <Text style={styles.signatureBox}>Signature of HOD</Text>
          <Text style={styles.signatureBox}>Signature of HRD Head</Text>
        </View>

        {/* For the Use of Accounts Department Section */}
        <View style={styles.accountsSection}>
          <Text style={[styles.boldText, { marginBottom: 10 }]}>For the use of Accounts Department:</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Advance Taken:</Text>
            <Text style={styles.inputLine}>{props.pdfData?.advanceRequired + ' /-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount Claimed:</Text>
            <Text style={styles.inputLine}>{(props.fareDetailsTotalAmount + props.taDaDetailsTotalAmount + props.LocalConvyTotalAmount + props.otherExpensesTotalAmount) + ' /-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sanctioned Amount: </Text>
            <Text style={styles.inputLine}>{props.submittedData?.sanctionedAmount === undefined ? 0 + ' /-' : props.submittedData?.sanctionedAmount + ' /-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Balance Amount: </Text>
            <Text style={styles.inputLine}>{props.balanceTotalAmount + ' /-'}</Text>
          </View>
          <Text style={[styles.label, { marginTop: 10 }]}>Remarks of Accounts Department:</Text>
          <View style={styles.remarksBox}>{props.submittedData?.accountsDepartmentRemarks}</View>

          {/* Signatures for Accounts Section */}
          <View style={styles.signatureSection}>
            <Text style={styles.signatureBox}>Verification Authority Signature with Date</Text>
            <Text style={styles.signatureBox}>Bill Passing Authority Signature with Date</Text>
            <Text style={styles.signatureBox}>Sanctioning Authority Signature with Date</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default TourExpensesClaimForm;
