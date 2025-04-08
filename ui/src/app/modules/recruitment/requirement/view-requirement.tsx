import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  RightSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  JobRatesActivateDeactivateReq,
  RecruitmentActivateDeactivateReq,
  ScopesEnum,
} from '@hrexpert/shared-models';
import {
  BranchesService,
  CompanySharedService,
  DesignationsService,
  JobRatesSharedService,
  JobsService,
  RecruitmentServiceSharedService,
} from '@hrexpert/shared-services';
import {
  Button,
  Col,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Switch,
  Table,
} from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType, ColumnType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { SequenceUtils } from '../../../../app/common/utils';
import AddRequirement from './add-requirement';
import dayjs from 'dayjs';

interface JobRatesGridIProps {
  scopes: ScopesEnum[];
}

const ViewRequirement = (props: JobRatesGridIProps) => {
  const { scopes } = props;
  const [open, setOpen] = useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = useState<number>(1);
  const [jobRatesData, setJobRateData] = useState<any>([]);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setisUpdate] = useState(false);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const designationsService = new DesignationsService();
  const [designations, setDesginations] = useState<any>([]);
  const [companyRecords, setCompanyRecords] = useState<any>([]);
  const recruitmentSharedservice = new RecruitmentServiceSharedService();
  const companyService = new CompanySharedService();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const showModal = (record) => {
    setSelectedProject(record);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
  };
  useEffect(() => {
    getRecruitment();
    getDesignations();
    getActiveCompany();
  }, []);

  const getActiveCompany = () => {
    try {
      companyService.getActiveCompany().then((res) => {
        if (res.status) {
          setCompanyRecords(res.data);
        } else {
          message.error('Failed to retrieve company');
        }
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const getRecruitment = () => {
    setLoading(true);
    try {
      recruitmentSharedservice.getRecruitment().then((res) => {
        if (res.status) {
          setJobRateData(res.data);
          setLoading(false);
        } else {
          message.error(res.internalMessage);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const activateDeactivateRecruitment = async (rowData: any) => {
    const newIsActive = !rowData.isActive;
    const req = new RecruitmentActivateDeactivateReq(
      rowData.id,
      newIsActive,
      rowData.versionFlag
    );
    try {
      recruitmentSharedservice
        .activateDeactivateRecruitment(req)
        .then((res) => {
          if (res.status) {
            message.success(res.internalMessage);
            getRecruitment();
          } else {
            message.error(res.internalMessage);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateRecruitment = (formData: any) => {
    try {
      recruitmentSharedservice.updateRecruitment(formData).then((res) => {
        if (res.status) {
          message.success('Updated SuccessFully');
          getRecruitment();
          setModalVisible(false);
          setisUpdate(false);
        } else {
          message.error(res.internalMessage);
        }
      });
    } catch (error) {
      console.error('Error Updating Job Rate Details:', error);
    }
  };

  const getDesignations = () => {
    designationsService.getActiveDesignations().then((res) => {
      if (res.status) {
        setDesginations(res.data);
      } else {
        setDesginations('No Data Found');
      }
    });
  };

  const openForm = () => {
    setSelectedData(null);
    setModalVisible(true);
  };

  const editDepartment = (rowData: any) => {
    if (rowData.notificationDate) {
      rowData.notificationDate = dayjs(rowData.notificationDate);
    }

    setSelectedData(rowData);
    setModalVisible(true);
    setisUpdate(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setisUpdate(false);
    getRecruitment();
  };

  const getColumnSearchProps = (
    dataIndex: any,
    title: any
  ): ColumnType<any> => ({
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
  const jobRates = [
    { title: 'Company', dataIndex: 'CompanyName' },
    { title: 'Job Description', dataIndex: 'jobDescription' },
    { title: 'Job Role', dataIndex: 'name' },
    { title: 'Technology', dataIndex: 'technology' },
    { title: 'Notification Date', dataIndex: 'notificationDate' },
    { title: 'Technology', dataIndex: 'technology' },
    { title: 'Billing Rate', dataIndex: 'billingRate' },
    { title: 'Experience', dataIndex: 'approxExperience' },
    { title: 'Min Project Duration', dataIndex: 'minProjectDuration' },
    { title: 'Job Location', dataIndex: 'jobLocation' },
    { title: 'Status', dataIndex: 'status' },
  ];

  const preprocessData = (data) => {
    return data.map((record, index) => {
      const updatedRecord = { key: index + 1 };
      jobRates.forEach((column) => {
        const value = record[column.dataIndex];
        updatedRecord[column.dataIndex] =
          value === null || value === undefined ? '' : value;
      });
      return updatedRecord;
    });
  };

  const exportExcel = () => {
    const excel = new Excel();
    const processedData = preprocessData(jobRatesData);
    excel
      .addSheet('Requirement')
      .addColumns(jobRates)
      .addDataSource(processedData, { str2num: false })
      .saveAs('Requirement.xlsx');
  };

  const columns: ColumnsType<any> = [
    {
      title: 'S No',
      render: (text, object, index) => (page - 1) * pageSize + (index + 1),
      align: 'center',
      fixed: 'left', // Optional: fix if you want
      width: 80,
    },
    {
      title: 'Company',
      dataIndex: 'CompanyName',
      ...getColumnSearchProps('CompanyName', 'Company'),
      align: 'center',
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Job Role',
      dataIndex: 'name',
      ...getColumnSearchProps('name', 'Job Role'),
      align: 'center',
      width: 200,
    },
    {
      title: 'Job Description',
      dataIndex: 'jobDescription',
      ...getColumnSearchProps('jobDescription', 'Job Description'),
      align: 'center',
      width: 250,
    },
    {
      title: 'Notification Date',
      dataIndex: 'notificationDate',
      ...getColumnSearchProps('notificationDate', 'Notification Date'),
      align: 'center',
      width: 180,
    },
    {
      title: 'Technology',
      dataIndex: 'technology',
      ...getColumnSearchProps('technology', 'Technology'),
      align: 'center',
      width: 150,
    },
    {
      title: 'Billing Rate',
      dataIndex: 'billingRate',
      align: 'center',
      width: 120,
    },
    {
      title: 'Experience',
      dataIndex: 'approxExperience',
      align: 'center',
      width: 120,
    },
    {
      title: 'Min Project Duration',
      dataIndex: 'minProjectDuration',
      align: 'center',
      width: 180,
    },
    {
      title: 'Job Location',
      dataIndex: 'jobLocation',
      align: 'center',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: 100,
    },
    {
      title: 'Action',
      align: 'center',
      fixed: 'right',
      width: 180,
      render: (text, rowData) => (
        <span>
          {rowData.isActive ? (
            <EditOutlined
              className={'editSamplTypeIcon'}
              onClick={() => editDepartment(rowData)}
              style={{
                color: '#1890ff',
                fontSize: '14px',
                display: SequenceUtils.fetchViewAccessScopes(
                  scopes,
                  ScopesEnum.Update
                ),
              }}
            />
          ) : (
            ''
          )}
          &nbsp; &nbsp; &nbsp;
          {/* <Popconfirm
            onConfirm={() => activateDeactivateRecruitment(rowData)}
            title={
              rowData.isActive
                ? 'Are you sure to Deactivate?'
                : 'Are you sure to Activate?'
            }
          >
            <Switch
              size="default"
              disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Delete)}
              className={rowData.isActive ? 'toggle-activated' : 'toggle-deactivated'}
              checkedChildren={<RightSquareOutlined />}
              unCheckedChildren={<RightSquareOutlined />}
              checked={rowData.isActive}
            />
          </Popconfirm> */}
          &nbsp;&nbsp;
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showModal(rowData)}
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <PageContainer
        title="Requirement"
        breadcrumbRender={false}
        extra={
          <Space>
            <Button
              type="primary"
              disabled={SequenceUtils.fetchVisibleAccessScopes(
                scopes,
                ScopesEnum.Create
              )}
              icon={<PlusOutlined />}
              onClick={openForm}
            >
              Add
            </Button>
            <Button
              style={{
                border: '1px dashed #22f534',
                color: 'green',
                fontWeight: 'bold',
              }}
              type="dashed"
              onClick={() => exportExcel()}
            >
              Get Excel
            </Button>
          </Space>
        }
      >
        <Table
          loading={loading}
          dataSource={jobRatesData}
          columns={columns}
          size="small"
          pagination={{
            pageSize: 10,
            onChange(current, pageSize) {
              setPage(current);
              setPageSize(pageSize);
            },
          }}
          rowKey="id"
          scroll={{ x: 'max-content' }} // enables horizontal scroll
        />
      </PageContainer>

      <Modal
        key={jobRatesData.id}
        title={isUpdate ? 'Update Requirement' : 'Create Requirement'}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width="60%"
      >
        <AddRequirement
          key={Date.now()}
          isUpdate={isUpdate}
          jobRatesData={selectedData}
          designations={designations}
          closeForm={closeModal}
          updateDetails={updateRecruitment}
          companyRecords={companyRecords}
        />
      </Modal>

      <Modal
        title="Requirement Details"
        visible={isModalVisible}
        onCancel={handleClose}
        footer={null}
        width="50%"
      >
        {selectedProject && (
          <Row gutter={16}>
            <Col span={12}>
              <p>
                <strong>Company:</strong> {selectedProject.CompanyName}
              </p>
              <p>
                <strong>Job Role:</strong> {selectedProject.name}
              </p>
              <p>
                <strong>Job Description:</strong>{' '}
                {selectedProject.jobDescription}
              </p>
              <p>
                <strong>Notification Date</strong>{' '}
                {selectedProject.notificationDate}
              </p>
              <p>
                <strong>Technology:</strong> {selectedProject.technology}
              </p>
              <p>
                <strong>No. of Resources:</strong>{' '}
                {selectedProject.planningClosingDate}
              </p>
              <p>
                <strong>Planned Closing Date</strong>{' '}
                {selectedProject.jobDescription}
              </p>
              <p>
                <strong>Billing Rate:</strong> {selectedProject.billingRate}
              </p>
              <p>
                <strong>Expenses Paid by Client:</strong>{' '}
                {selectedProject.expensesPaid}
              </p>
              <p>
                <strong>Approx Experience:</strong> {selectedProject.experience}{' '}
                years
              </p>
            </Col>
            <Col span={12}>
              {/* <p>
                <strong>Job Role:</strong> {selectedProject.name}
              </p> */}
              <p>
                <strong>Job Location:</strong> {selectedProject.jobLocation}
              </p>
              <p>
                <strong>Posted Date:</strong> {selectedProject.postedDate}
              </p>
              <p>
                <strong>Target Date:</strong> {selectedProject.targetDate}
              </p>
              <p>
                <strong>Min Project Duration:</strong>{' '}
                {selectedProject.minProjectDuration}
              </p>
              <p>
                <strong>Expanses Paid by Client</strong>{' '}
                {selectedProject.expensesPaidByClient} years
              </p>
              <p>
                <strong>Status:</strong> {selectedProject.status}
              </p>
              <p>
                <strong>Remarks:</strong> {selectedProject.remarks || 'N/A'}
              </p>
            </Col>
          </Row>
        )}
      </Modal>
    </>
  );
};
export default ViewRequirement;
