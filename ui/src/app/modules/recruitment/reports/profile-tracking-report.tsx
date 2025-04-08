import React, { useEffect, useRef, useState } from 'react';
import { Table, Input, DatePicker, Select, Button, Space, message } from 'antd';
import { FileExcelOutlined, SearchOutlined } from '@ant-design/icons';
import { ColumnsType, ColumnType } from 'antd/es/table';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
import { RecruitmentServiceSharedService } from '@hrexpert/shared-services';
import { IExcelColumn } from 'antd-table-saveas-excel/app';
import { Excel } from 'antd-table-saveas-excel';

const { Option } = Select;

const ProfileTrackingReport: React.FC = () => {
  const [profilesData, setJobRateData] = useState<any>([]);
  const recruitmentSharedservice = new RecruitmentServiceSharedService();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<any>([]);
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = useState<number>(1);


  useEffect(() => {
    getRecruitment();

  }, []);
  const getRecruitment = () => {

    try {
      recruitmentSharedservice.getProfileReportById().then((res) => {
        if (res.status) {
          setFilteredData(res.data);

        } else {
          message.error(res.internalMessage);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };


  const getColumnSearchProps = (dataIndex: any, title: any): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${title}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              handleReset(clearFilters);
              setSearchedColumn(dataIndex);
              confirm({ closeDropdown: true });
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase())
        : false,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  function handleReset(clearFilters: any) {
    clearFilters();
    setSearchText('');
  }

  let i = 1;
  const profileTrack = [
    { title: 'S No', dataIndex: 'sNo', render: (text, object, index) => { return i++; } },
    { title: 'Candidate Name', dataIndex: 'candidateName' },
    { title: 'Profile Date', dataIndex: 'profileDate' },
    { title: 'Mobile Number', dataIndex: 'mobileNumber' },
    { title: 'Qualification', dataIndex: 'qualification' },
    { title: 'Technologies', dataIndex: 'technologies' },
    { title: 'SourceType', dataIndex: 'sourceType' },
    { title: 'Screening', dataIndex: 'screening' },
    { title: 'InternalSelected', dataIndex: 'internalSelected' },
    { title: 'Status', dataIndex: 'status' },


  ];

  const exportExcel = () => {
    const excel = new Excel();
    const calculateColumnWidths = (columns: IExcelColumn[], data: any[]) =>
      columns.map((col: any) => ({
        ...col,
        width: Math.max(
          col.title.toString().length,
          ...data.map((row) => row[col.dataIndex]?.toString().length || 0)
        ) * 12
      }));
    const adjustedColumns = calculateColumnWidths(profileTrack, filteredData);
    excel
      .addSheet(`attendance-report`)
      .addColumns(adjustedColumns)
      .addDataSource(filteredData, { str2num: true })
      .saveAs('attendance-report.xlsx');
  }
  const columns: ColumnsType<any> = [
    {
      title: 'S No',
      render: (text, object, index) => (page - 1) * pageSize + (index + 1),
      align: 'center',
      fixed: 'left', // Optional: fix if you want
      width: 80,
    },
    {
      title: 'Candidate Name',
      dataIndex: 'candidateName',
      key: 'candidateName',
      ...getColumnSearchProps('candidateName', 'Candidate Name'),
      align: 'center',
    },
    {
      title: 'Profile Date',
      dataIndex: 'profileDate',
      key: 'profileDate',
      align: 'center',
      ...getColumnSearchProps('profileDate', 'Profile Date'),
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      ...getColumnSearchProps('mobileNumber', 'Mobile Number'),
      align: 'center',
    },
    {
      title: 'Qualification',
      dataIndex: 'qualification',
      key: 'qualification',
      ...getColumnSearchProps('qualification', 'Qualification'),
      align: 'center',
    },
    {
      title: 'Technologies',
      dataIndex: 'technologies',
      key: 'technologies',
      ...getColumnSearchProps('technologies', 'Technologies'),
      align: 'center',
    },
    {
      title: 'Source Type',
      dataIndex: 'sourceType',
      key: 'sourceType',
      ...getColumnSearchProps('sourceType', 'Source Type'),
      align: 'center',
    },
    {
      title: 'Screening',
      dataIndex: 'screening',
      key: 'screening',
      ...getColumnSearchProps('screening', 'Screening'),
      align: 'center',
    },
    {
      title: 'Internal Selected',
      dataIndex: 'internalSelected',
      key: 'internalSelected',
      ...getColumnSearchProps('internalSelected', 'Internal Selected'),
      align: 'center',
    },
    {
      title: 'Interview Status',
      dataIndex: 'status',
      key: 'status',

      align: 'center',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile Tracking Report</h2>
      <Button icon={<FileExcelOutlined />} style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={exportExcel}>
        Get Excel
      </Button>
      <Table
        columns={columns}
        dataSource={filteredData}
        bordered
        pagination={{ pageSize: 20 }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default ProfileTrackingReport;
