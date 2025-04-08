import { FileExcelFilled } from '@ant-design/icons';
import { LeaveAllocationService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, message, Row, Table } from 'antd';
import saveAs from 'file-saver';
import Papa from 'papaparse';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

export const LeaveAllocationExcel = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [leaveTypeData, setLeaveTypeData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const leaveAllocationService = new LeaveAllocationService();

  useEffect(() => {
    getLeaveTypes();
  }, []);

  
  const getLeaveTypes = async () => {
    const res = await leaveAllocationService.getAllActiveLeaveTypes();
    setLeaveTypeData(res.status ? res.data : []);
  };

  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.name.split('.').pop()?.toLowerCase();

      if (fileType === 'csv') {
        setSelectedFile(file);
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => setData(result.data),
        });
      } else if (fileType === 'xls' || fileType === 'xlsx') {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const binaryStr = e.target?.result as string;
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
          setData(sheetData);
        };
        reader.readAsBinaryString(file);
      } else {
        alert('Please select a valid CSV or Excel file.');
        setSelectedFile(null);
      }
    }
  };

  // Validate columns
  const validateColumns = (columns: string[]) => {
    const expectedColumns = ['Employee Code', ...leaveTypeData.map((leave) => leave.typeOfLeave)];
    return expectedColumns.every((col, index) => col === columns[index]);
  };

  // Handle data upload
  const handleUpload = async () => {
    if (data.length > 0) {
      const fileColumns = Object.keys(data[0]);
      const isValid = validateColumns(fileColumns);

      if (!isValid) {
        message.error('Column names do not match the expected format.');
        return;
      }

      try {
        const response = await leaveAllocationService.allocateLeaveExcel(data);
        if (response.status) {
          message.success('Leave allocations saved successfully.');
          // navigate('/leave-allocation-view');
          window.location.reload()
        } else {
          message.error('Failed to save leave allocations.');
        }
      } catch (error) {
        message.error('An error occurred while uploading the data.');
      }
    } else {
      message.warning('No data to upload.');
    }
  };

  // Generate sample CSV for download
  const exportCSV = () => {
    const sampleData = [['Employee Code', ...leaveTypeData.map((leave) => leave.typeOfLeave)]];
    const csvContent = sampleData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Leave-Allocation.csv');
  };

  // Generate table columns dynamically
  const tableColumns = [
    { title: 'Employee Code', dataIndex: 'Employee Code', key: 'employeeCode' },
    ...leaveTypeData.map((leave) => ({
      title: leave.typeOfLeave,
      dataIndex: leave.typeOfLeave,
      key: leave.typeOfLeave,
    })),
  ];

  return (
    <Card
      title="Leave Allocation"
      extra={
        <Button
          type="default"
          style={{ color: 'green' }}
          onClick={exportCSV}
          icon={<FileExcelFilled />}
        >
          Sample Format
        </Button>
      }
    >
      <Form layout="horizontal">
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="Upload Excel">
              <input
                type="file"
                accept=".csv, .xls, .xlsx"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <small style={{ color: 'blue' }}>Only CSV, XLS, and XLSX files are allowed</small>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Button type="primary" disabled={!selectedFile} onClick={handleUpload}>
              Upload
            </Button>
          </Col>
        </Row>
      </Form>

      {data.length > 0 && (
        <Table
          columns={tableColumns}
          dataSource={data}
          pagination={{
            current: page,
            onChange: setPage,
            position: ['topRight'],
          }}
          scroll={{ x: true }}
          rowKey="Employee Code"
          bordered
        />
      )}
    </Card>
  );
};

export default LeaveAllocationExcel;
