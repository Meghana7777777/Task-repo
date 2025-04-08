import { Button, Card, Col, Form, message, Row, Table } from 'antd';
import Papa from 'papaparse';
import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { FileExcelFilled } from '@ant-design/icons';
import { Excel } from 'antd-table-saveas-excel';
import React from 'react';
import moment from 'moment';
import saveAs from 'file-saver';
import { AttendanceServices } from '@hrexpert/shared-services';
import { AlertMessages } from '@hrexpert/shared-models';
import { useNavigate } from 'react-router-dom';
import { IExcelColumn } from 'antd-table-saveas-excel/app';

export const AttendanceExcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]);
  const service = new AttendanceServices();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [page, setPage] = React.useState(1);
  const fileInputRef = useRef(null);

  const importExcel = (file: any[]) => {
    var data = new Uint8Array(file);
    var wb = XLSX.read(data, { type: 'array', cellDates: true });
    let sheet: any[] = [];
    for (const Sheet in wb.Sheets) {
      if (Sheet) {
        if (wb.Sheets.hasOwnProperty(Sheet)) {
          sheet.push(
            XLSX.utils.sheet_to_json(wb.Sheets[Sheet], { raw: true, header: 1 })
          );
        }
      }
    }
    return sheet;
  };



  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);

      Papa.parse(file, {
        header: true,
        complete: function (result) {
          try {
            const formattedData = result.data
              .filter((row) => Object.values(row).some((value) => value))
              .map((row) => ({
                'Employee Code': row['Employee Code'] || '',
                Date: row['Date']
                  ? moment(row['Date'], 'DD/MM/YYYY').format('YYYY-MM-DD')
                  : '',
                'In Time':
                  row['In Time'] && row['In Time']
                    ? moment(`${row['In Time']} ${row['In Time']}`, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss')
                    : '',
                'Out Time':
                  row['Out Time'] && row['Out Time']
                    ? moment(`${row['Out Time']} ${row['Out Time']}`, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss')
                    : '',
                'Attendance Status': row['Attendance Status'] || '',
              }));

            const validData = formattedData.filter((row) =>
              row['Employee Code'] && row.Date && row['In Time'] && row['Out Time'] && row['Attendance Status']
            );

            // if (validData.length !== formattedData.length) {
            //   alert(
            //     `Some rows were invalid and skipped. Processed ${validData.length} of ${formattedData.length} rows.`
            //   );
            // }

            setData(validData);
          } catch (error) {
            alert('Error processing the file. Please check its format.');
            console.error(error);
          }
        },
        skipEmptyLines: true,
      });
    } else {
      alert('Please select a valid .csv file.');
      setSelectedFile(null);
    }
  };




  const handleUpload = async () => {
    try {
      form.validateFields().then(async () => {
        const res = await service.attendanceUpload(data);
        if (res.status) {
          navigate('/leave-management/attendance-aprroval');
          message.success("Attendance Adjustment Updated Successfully");
          if (res.data.status == true) {
            AlertMessages.getSuccessMessage(res.data.internalMessage);
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          } else {
            AlertMessages.getErrorMessage(res.data.internalMessage);
          }
        } else if (!res.status && res.errorCode === 1116) {
          AlertMessages.getErrorMessage(res.internalMessage);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      });
    } catch (error) {
      AlertMessages.getErrorMessage(error.message);
    }
  };



  const excelColumns = [
    {
      title: 'Employee Code',
      dataIndex: 'Employee Code',
    },
    {
      title: 'Date',
      dataIndex: 'Date',
      formatter: (value) => {
        if (value) {
          return moment(value, 'YYYY-MM-DD').format('YYYY-MM-DD');
        }
        return value;
      },
    },
    {
      title: 'In Time',
      dataIndex: 'In Time',
      formatter: (value) => {
        if (value) {
          return moment(value, 'YYYY-MM-DD HH:mm:ss').format(
            'YYYY-MM-DD HH:mm:ss'
          );
        }
        return value;
      },
    },
    {
      title: 'Out Time',
      dataIndex: 'Out Time',
      formatter: (value) => {
        if (value) {
          return moment(value, 'YYYY-MM-DD HH:mm:ss').format(
            'YYYY-MM-DD HH:mm:ss'
          );
        }
        return value;
      },
    },
    {
      title: 'Attendance Status',
      dataIndex: 'Attendance Status',
    },
  ];

  const attendanceInfo = [
    'P - Present',
    'A - Absent',
    'P/2 - Half Day',
    'OD - Out Door'
  ];

  const exportCSV = () => {
    const excelData = [
      {
        "Employee Code": "XYZ",
        "Date": "20-08-2024",
        "In Time": "20-08-2024 09:00:00",
        "Out Time": "20-08-2024 18:00:00",
        "Present Status": "P"
      },
      {
        "Employee Code": "ABC",
        "Date": "20/08/2024",
        "In Time": "20/08/2024 10:00:00",
        "Out Time": "20/08/2024 19:00:00",
        "Present Status": "A"
      }
    ];


    const excelColumns = [
      { title: 'Employee Code', dataIndex: 'Employee Code' },
      { title: 'Date', dataIndex: 'Date' },
      { title: 'In Time', dataIndex: 'In Time' },
      { title: 'Out Time', dataIndex: 'Out Time' },
      { title: 'Attendance Status', dataIndex: 'Attendance Status' }
    ];

    // Header row
    let csvContent = excelColumns.map(col => `"${col.title}"`).join(",") + ',"Reference Status"\n';

    // Maximum rows to align attendance info on the side
    const maxRows = Math.max(excelData.length, attendanceInfo.length);

    for (let i = 0; i < maxRows; i++) {
      const row = excelData[i] || {}; // Handle missing data rows
      const rowData = excelColumns.map(column => {
        let cellValue = row[column.dataIndex] || ''; // Handle missing values
        return `"${cellValue}"`;
      });

      // Append attendance status reference in the last column
      rowData.push(`"${attendanceInfo[i] || ''}"`);

      csvContent += rowData.join(",") + "\n";
    }

    // Create CSV file and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Attendance-Upload-Sample.csv");
  };

  return (
    <Card
      title={<span style={{ display: 'flex', justifyContent: 'center', color: 'white' }}>Attendance Upload</span>}
      extra={
        <span style={{ color: 'white' }}>
          <Button
            type="default"
            style={{ color: 'green' }}
            onClick={exportCSV}
            icon={<FileExcelFilled />}
          >
            Sample Format
          </Button>
        </span>
      }
      style={{ textAlign: 'center' }}
      headStyle={{ backgroundColor: '#69c0ff', border: 0 }}
    >
      <Form layout="horizontal">
        <Row gutter={24}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 6 }}
            lg={{ span: 6 }}
            xl={{ span: 6 }}
          >
            <Form.Item label="Upload Excel">
              <input
                placeholder="Upload Excel"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
              <label style={{ color: 'blue', whiteSpace: 'nowrap' }}>
                Only csv
              </label>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 6 }}
            lg={{ span: 6 }}
            xl={{ span: 6 }}
          >
            <Button
              type="primary"
              onClick={handleUpload}
              loading={loading}
              disabled={!selectedFile}
            >
              Upload
            </Button>
          </Col>
        </Row>
      </Form>

      {data.length > 0 && (
        <Table
          columns={excelColumns}
          dataSource={data}
          pagination={{
            onChange(current) {
              setPage(current);
            },
            position: ['topRight'],
          }}
          scroll={{ x: true }}
          rowKey="id"
          bordered
        />
      )}
    </Card>
  );
};

export default AttendanceExcel;
