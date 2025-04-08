import { CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, EyeOutlined, FilterOutlined, FolderOpenOutlined, FormOutlined, RightSquareOutlined, ScheduleOutlined, SearchOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { AlertMessages, ApplyLeaveBrachDto, EmpDataReq, EmployeeDetailsDto, EmployeesActivateDeactivateDto, EmployeeViewModel, EmployeIdReq, ScopesEnum } from '@hrexpert/shared-models';
import { ApplForLeavesSharedService, configVariables, EmployeeOnboardingService, LeaveAllocationService } from '@hrexpert/shared-services';
import { Button, Card, Checkbox, DatePicker, Flex, Form, Image, Input, message, Modal, Popconfirm, Popover, Row, Select, Space, Switch, Table, Tag, Tooltip } from 'antd';
import { ColumnProps, ColumnType } from 'antd/es/table';
import { FilterDropdownProps, TableRowSelection } from 'antd/es/table/interface';
import { Col } from 'antd/lib';
import { default as dayjs, default as daysjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import { LiaUserEditSolid } from "react-icons/lia";
import { useNavigate } from 'react-router-dom';
import { useIAMClientState } from '../../../../../common/iam-client-react';
import { SequenceUtils } from '../../../../../common/utils';
import EmployeeExitDocumentDataPdf from '../../../../../modules/employee-froms/employee-excit-document-pdf';
import SampleOfferLetterPdf from '../../../../../modules/employee-froms/Sample-Offer-Letter-pdf';
import CertificateEmployee from '../../../../../modules/employee-froms/statutory-handovers/certificate-employee';
import EmployeeJoiningForm from '../../../../../modules/employee-froms/statutory-handovers/employee-joining-form';
import ExperienceForm from '../../../../../modules/employee-froms/statutory-handovers/experience-form';
import FinalSettlementtPdf from '../../../../../modules/employee-froms/statutory-handovers/Final Settelment-pdf';
import EmployeeForm from '../../pages/employee-form/employee-form';
import EmployeeDeactiveForm from '../../pages/employee-view/employee-deactive-model';
import '../employees-table-view/emp-table-view.css';
interface EmployeeTableViewProps {
  employeeData: EmployeeViewModel[]
  loading?: boolean;
  getEmployeeData?: any;
  totalCount: number;
  scopes: ScopesEnum[]
  totalActive: number
  totalInactive: number
  employeeFileData: any
  onPageChange: any
  pagination: any,
  setPagination: any,
  employeesTypeCount: number,
  workersTypeCount: number
}
const EmployeeTableView = ({ employeeData, loading, getEmployeeData, totalCount, scopes, totalActive, totalInactive, employeeFileData, onPageChange, pagination, setPagination, employeesTypeCount, workersTypeCount }: EmployeeTableViewProps) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const config = configVariables
  const [isUpdate, setIsUpdate] = useState(false);
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState(false);
  const service = new EmployeeOnboardingService()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoiningFormOpen, setIsJoiningFormOpen] = useState(false);
  const [isFullFinalRecordFormOpen, setIsFullFinalRecordFormOpen] = useState(false);
  const [isExitFormOpen, setIsExitFormOpen] = useState(false);
  const [isOfferLetterFormOpen, setIsOfferLetterFormOpen] = useState(false);
  const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
  const [isCertificateFormOpen, setIsCertificateFormOpen] = useState(false);
  const [isRelivingFormOpen, setIsRelivingFormOpen] = useState(false);
  const [previewIdProffFile, setPreviewIdProffFile] = useState(null);
  const [previewExperienceFile, setPreviewExperienceFile] = useState(null);
  const [joiningRecord, setJoiningRecord] = useState<any>([]);
  const [fullFinalRecord, setFullFinalRecord] = useState<any>([]);
  const [exitRecord, setExitRecord] = useState<any>([]);
  const [isOfferLetterRecord, setIsOfferLetteRecord] = useState<any>([]);
  const [isExperienceRecord, setIsExperienceRecord] = useState<any>([]);
  const [isCertificateRecord, setIsCertificateRecord] = useState<any>([]);
  const [isRelivingRecord, setIsRelivingRecord] = useState<any>([]);
  const [loadings, setLoadings] = useState<boolean>(false)
  const { IAMClientAuthContext } = useIAMClientState();
  const role = IAMClientAuthContext.user.roles;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const services = new ApplForLeavesSharedService()
  const [selectedEmployee, setSelectedEmployee] = useState<any>([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState(null);
  const [feildRepoManager, setFeildRepoManager] = useState(null);
  const [leaveAllocations, setLeaveAllocations] = useState<any[]>([]);
  const leaveAllocationservice = new LeaveAllocationService()
  const [form] = Form.useForm()
  const { Option } = Select
  const empService = new EmployeeOnboardingService()
  const editEmployee = (rowData: EmployeeDetailsDto) => {
    getEmployeeDetails(rowData.id);
    setIsUpdate(true);
    setModalVisible(true);
  };
  const editadaectiveEmploee = (rowData: EmployeeDetailsDto) => {
    getEmployeeDetails(rowData.id);
    setIsUpdate(true);
    setModalVisibles(true);
  }

  useEffect(() => {

  }, [feildRepoManager])
  useEffect(() => {
    getActiveEmployeesById()
  }, [])

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEmployeeData(null);
    setIsUpdate(false);
    getEmployeeData()
  };

  const closeModals = () => {
    setModalVisibles(false);
    setSelectedEmployeeData(null);
    setIsUpdate(false);
    getEmployeeData()

  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getEmployeeDetails = (employeeId: number) => {
    const req = new EmployeIdReq(employeeId)
    service.getEmpById(req).then((res) => {
      if (res.status) {
        setSelectedEmployeeData(res.data);
      } else {
        message.error(res.internalMessage);
      }
    })
  }

  const getAllLeaveAllocationsData = (employeeCode) => {

    const req = new EmpDataReq(null, null, null, dayjs().format('YYYYMM'), null,
      null, null, 1, null, employeeCode
    );
    try {
      leaveAllocationservice.getAllNewLeaveAllocationsLeaveTypes(req).then((res) => {
        if (res.status) {
          setLeaveAllocations(res.data)
        } else {
          setLeaveAllocations([])
          message.warning('Leaves yet to be allocated', 2)
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

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
          style={{ marginBottom: 8, display: "block" }}
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
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
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
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  /**
   *
   * @param selectedKeys
   * @param confirm
   * @param dataIndex
   */
  function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  function handleReset(clearFilters: any) {
    clearFilters();
    setSearchText("");
  }

  const activateAndDeactive = async (rowData: any) => {
    const newIsActive = !rowData.isActive;
    const req = new EmployeesActivateDeactivateDto(
      rowData.employeeId,
      newIsActive,
    );
    try {
      service.activateAndDeactiveEmployees(req).then((res) => {
        if (res.status) {
          message.success(res.internalMessage);
          getEmployeeData()
        } else {
          message.error(res.internalMessage);
        }
      })
    } catch (error) {
      console.log(error);
    }
  };

  let i = 1;
  const employee = [
    { title: "S.No", dataIndex: "sno" },
    { title: "Employee Name", dataIndex: "fullName" },
    { title: "Employee Code", dataIndex: "employeeCode" },
    { title: "Branch Name", dataIndex: "branchName" },
    { title: "Department", dataIndex: "departmentName" },
    { title: "Designation", dataIndex: "designationName" },
    { title: "Mobile Number", dataIndex: "mobileNo" },
    { title: "Date of Birth", dataIndex: "dateOfBirth" },
    { title: "Date of Joining", dataIndex: "dateOfJoining" },
    { title: "Email ID", dataIndex: "emailId" },
    { title: "Current Address", dataIndex: "currentAddress" },
    { title: "Current State", dataIndex: "currentState" },
    { title: "Current Pincode", dataIndex: "currentPincode" },
    { title: "Permanent Address", dataIndex: "permanentAddress" },
    { title: "Permanent State", dataIndex: "permanentState" },
    { title: "Permanent Pincode", dataIndex: "permanentPincode" },
    { title: "Salary", dataIndex: "salary" },
    { title: "Provident Fund No.", dataIndex: "pfNo" },
    { title: "ESIC Number", dataIndex: "esicNo" },
    { title: "Bank Name", dataIndex: "bankName" },
    { title: "Bank Account No.", dataIndex: "bankAcNo" },
    { title: "Bank IFSC Code", dataIndex: "bankIfscCode" },
    { title: "Nominee", dataIndex: "nominee" },
    { title: "Reporting Manager", dataIndex: "reportingManagerName" },
    { title: "Date Of Reliving", dataIndex: "dateOfReliving" },
    { title: "Reason Of Reliving", dataIndex: "reasonOfReliving" },
    { title: "Gender", dataIndex: "gender" },
  ];


  const Leavecolumns: ColumnProps<any>[] = [
    {
      title: "Leave",
      align: "center",
      dataIndex: 'leaveName'
    },
    {
      title: "Allocated",
      align: "center",
      dataIndex: 'leavesAlloted'
    },
    {
      title: "Utilized",
      align: "center",
      dataIndex: 'leavesUsed'
    },
    {
      title: "Balance",
      align: "center",
      dataIndex: 'available'
    },
  ]

  const preprocessData = (data) => {
    return data.map((record, index) => {
      const updatedRecord = { sno: index + 1 }; // Add S.No
      employee.forEach((column) => {
        const key = column.dataIndex;

        if (key === "dateOfBirth" || key === "dateOfJoining" || key === "dateOfReliving") {
          // Format date columns
          updatedRecord[key] = record[key] ? daysjs(record[key]).format("DD/MM/YYYY") : "";
        } else if (key === "isActive") {
          // Convert isActive to Active/Inactive
          updatedRecord[key] = record[key] ? "Active" : "Inactive";
        } else {
          updatedRecord[key] = record[key] ?? "";
        }
      });
      return updatedRecord;
    });
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: (keys: React.Key[], rows: any[]) => {
      setSelectedRowKeys(keys)
      setSelectedRows(rows)
    },
  };

  const bulkActiveInactive = (isActive) => {
    try {
      const req = { isActive: isActive, id: selectedRowKeys }
      service.bulkEmpActiveInactive(req).then((res) => {
        if (res.status) {
          message.success(res.internalMessage);
          getEmployeeData()
        } else {
          message.error(res.internalMessage);
        }
      })
    } catch (error) {
      console.log(error);
    }

  }

  const handleClickedJoinigForm = (rec) => {
    try {
      const reqData = { id: rec }
      empService.getAllEmployeesTableFroms(reqData).then((res) => {
        if (res.status) {
          setJoiningRecord(res.data)
          setIsJoiningFormOpen(true)
          setOpenPopover(true)
        } else {
          AlertMessages.getErrorMessage('No Data Found');
          setJoiningRecord([])
        }
      })
    } catch (err) {
      console.error(err);
      // AlertMessages.getErrorMessage('An error occurred while fetching data.');
      setLoadings(false);
    }
  }

  const handleClickedFullAndFinalForm = (rec) => {
    try {
      const reqData = { id: rec }
      empService.getAllEmployeesTableFroms(reqData).then((res) => {
        if (res.status) {
          setFullFinalRecord(res.data)
          setIsFullFinalRecordFormOpen(true)
          setOpenPopover(true)
        } else {
          AlertMessages.getErrorMessage('No Data Found');
          setFullFinalRecord([])
        }
      })
    } catch (err) {
      console.error(err);
      setLoadings(false);
    }
  }


  const handleClickedExitForm = (rec) => {
    try {
      const reqData = { id: rec }
      empService.getAllEmployeesTableFroms(reqData).then((res) => {
        if (res.status) {
          setExitRecord(res.data)
          setIsExitFormOpen(true)
          setOpenPopover(true)
        } else {
          AlertMessages.getErrorMessage('No Data Found');
          setExitRecord([])
        }
      })
    } catch (err) {
      console.error(err);
      setLoadings(false);
    }
  }
  const handleClickedOfferLetterForm = (rec) => {
    try {
      const reqData = { id: rec }
      empService.getAllEmployeesTableFroms(reqData).then((res) => {
        if (res.status) {
          setIsOfferLetteRecord(res.data)
          setIsOfferLetterFormOpen(true)
          setOpenPopover(true)
        } else {
          AlertMessages.getErrorMessage('No Data Found');
          setIsOfferLetteRecord([])
        }
      })
    } catch (err) {
      console.error(err);
      setLoadings(false);
    }
  }
  const handleClickedExperienceForm = (rec) => {
    try {
      const reqData = { id: rec }
      empService.getAllEmployeesTableFroms(reqData).then((res) => {
        if (res.status) {
          setIsExperienceRecord(res.data)
          setIsExperienceFormOpen(true)
          setOpenPopover(true)
        } else {
          AlertMessages.getErrorMessage('No Data Found');
          setIsExperienceRecord([])
        }
      })
    } catch (err) {
      console.error(err);
      setLoadings(false);
    }
  }
  const handleClickedCertificateForm = (rec) => {
    try {
      const reqData = { id: rec }
      empService.getAllEmployeesTableFroms(reqData).then((res) => {
        if (res.status) {
          setIsCertificateRecord(res.data)
          setIsCertificateFormOpen(true)
          setOpenPopover(true)
        } else {
          AlertMessages.getErrorMessage('No Data Found');
          setIsCertificateRecord([])
        }
      })
    } catch (err) {
      console.error(err);
      setLoadings(false);
    }
  }

  const handleClickedRelevingForm = (rec) => {
    try {
      const reqData = { id: rec }
      empService.getAllEmployeesTableFroms(reqData).then((res) => {
        if (res.status) {
          setIsRelivingRecord(res.data)
          setIsRelivingFormOpen(true)
          setOpenPopover(true)
        } else {
          AlertMessages.getErrorMessage('No Data Found');
          setIsRelivingRecord([])
        }
      })
    } catch (err) {
      console.error(err);
      setLoadings(false);
    }
  }

  const getActiveEmployeesById = () => {
    try {
      const req = new ApplyLeaveBrachDto();
      const formValues = form.getFieldsValue();
      if (IAMClientAuthContext.user?.roles === "SuperAdmin") {
        req.branchId = null;
      } else {
        req.branchId = IAMClientAuthContext.user?.unitId || null;
      }
      services.getActiveEmployeesByIds(req).then((res) => {
        if (res.status) {
          setSelectedEmployee(res.data.data);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleJoiningFormClose = () => {
    setIsJoiningFormOpen(false)
  }

  const handleFullAndFinalFormClose = () => {
    setIsFullFinalRecordFormOpen(false)
  }

  const handleExitFormClose = () => {
    setIsExitFormOpen(false)
  }

  const handleOfferLetterFormClose = () => {
    setIsOfferLetterFormOpen(false)
  }

  const handleExperienceFormClose = () => {
    setIsExperienceFormOpen(false)
  }

  const handleCertificateFormClose = () => {
    setIsCertificateFormOpen(false)
  }

  const handleRelevingFormClose = () => {
    setIsRelivingFormOpen(false)
  }

  const handleOpenModal = (reco) => {
    setFeildRepoManager(reco.reportingManager)
    setSelectedEmployeeCode(reco.employeeCode);
    setIsOpenModal(true);
  };

  const handleCloseOpenModal = () => {
    form.resetFields(['reportingManager'])
    setIsOpenModal(false)
  }

  const handleSubmitUpdate = ({ selectedManager }) => {
    if (!selectedManager) {
      AlertMessages.getErrorMessage('Please select a Reporting Manager.');
      return;
    }
    const reqData = { employeeCode: selectedEmployeeCode, req: selectedManager };
    empService.updateReportingManager(reqData).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage('Reporting Manager Ppdated');
        form.resetFields(['reportingManager'])
        setIsOpenModal(false);
      } else {
        AlertMessages.getErrorMessage('Failed To Update');
      }
    }).catch((err) => {
      console.error(err, ":::::::");
    });
  };

  const getColumnSearchPropsEmpName = (dataIndex: any, title: any): ColumnType<any> => ({
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
          style={{ marginBottom: 8, display: "block" }}
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
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record.firstName?.toLowerCase().includes((value as string).toLowerCase()) ||
      record.lastName?.toLowerCase().includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
      }
    },
    render: (text, record) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={`${record.firstName} ${record.lastName || ""}`.trim()}
        />
      ) : (
        `${record.firstName} ${record.lastName || ""}`.trim()
      ),
  });

  const getColumnSearchPropsDateOfBirth = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
      <><div style={{ padding: 5 }} onKeyDown={(e) => e.stopPropagation()}>
        <DatePicker
          placeholder={`Search ${title}`}
          style={{ width: 180 }}
          format="DD/MM/YYYY"
          onChange={(date) => setSelectedKeys(date ? [dayjs(date).format('YYYY-MM-DD')] : [])} />
      </div>
        <div style={{ padding: 5 }}>
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                clearFilters && handleReset(clearFilters);
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
      </>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      dayjs(record[dataIndex]).isValid() && dayjs(record[dataIndex]).format('YYYY-MM-DD') === value,
    render: (text, record) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={dayjs(record[dataIndex]).isValid() ? dayjs(record[dataIndex]).format('DD/MM/YYYY') : '-'}
        />
      ) : (
        dayjs(record[dataIndex]).isValid() ? dayjs(record[dataIndex]).format('DD/MM/YYYY') : '-'
      ),
  });

  const isPDF = (url) => url?.toLowerCase().endsWith('.pdf');
  const columns: ColumnProps<any>[] = [
    {
      title: 'S No',
      key: 'sno',
      width: '40px',
      align: "center",
      render: (text, object, index) =>
        (pagination.current - 1) * pagination.pageSize + (index + 1),
    },
    {
      title: "Employee Name",
      fixed: 'left',
      align: "center",
      width: 150,
      ...getColumnSearchPropsEmpName("firstName", "Employee Name"),
      render: (v, obj) => `${obj.firstName} ${obj.lastName || ""}`.trim(),
    },
    {
      title: "Employee Code",
      fixed: 'left',
      align: "center",
      dataIndex: "employeeCode",
      width: 130,
      ...getColumnSearchProps("employeeCode", "Employee Code")
    },
    // {
    //   title: "Employee Type",
    //   width: 125,
    //   dataIndex: "empTypeName",
    //   ...getColumnSearchProps("empTypeName", "Employee Type")
    // },
    {
      title: "Branch",
      dataIndex: "branchName",
      width: 180,
      ...getColumnSearchProps("branchName", "Branch")
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      width: 140,
      ...getColumnSearchProps("departmentName", "Department")
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      width: 140,
      ...getColumnSearchProps("designationName", "Designation")
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNo",
      align: "center",
      width: 130,
      ...getColumnSearchProps("mobileNo", "Mobile Number")
    },
    {
      title: 'Date of Birth',
      width: 90,
      render: (v, obj) => dayjs(obj.dateOfBirth).format('DD/MM/YYYY'),
      ...getColumnSearchPropsDateOfBirth('dateOfBirth', 'Date of Birth'),
    },
    {
      title: "Date of Joining",
      dataIndex: "dateOfJoining",
      width: 110,
      render: (date: string) => (date ? daysjs(date).format("DD/MM/YYYY") : ""),
      ...getColumnSearchPropsDateOfBirth('dateOfJoining',"Date Of Joining")
    },
    {
      title: "Years of Experience",
      width: 170,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search years"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 180, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!record.dateOfJoining) return false;
        const startDate = dayjs(record.dateOfJoining);
        const today = dayjs();
        const diff = dayjs.duration(today.diff(startDate));
        const years = diff.years();
        return years.toString() === value.toString();
      },
      render: (_: any, rec: any) => {
        if (!rec.dateOfJoining) return "-";
        const startDate = dayjs(rec.dateOfJoining);
        const today = dayjs();
        const diff = dayjs.duration(today.diff(startDate));
        return `${diff.years()}y ${diff.months()}m ${diff.days()}d`;
      },
    },
    {
      title: "Email ID",
      width: 200,
      dataIndex: "emailId",
      ...getColumnSearchProps("emailId", "Email ID")
    },
    // {
    //   title: "Salary",
    //   width: 100,
    //   dataIndex: "salary"
    // },
    {
      title: "Pay Cycle",
      width: 100,
      render: (_, record) => record.empTypeName === "EMPLOYEE" ? "Monthly" : "Day Wise",
      ...getColumnSearchProps("empTypeName", "Pay Cycle")
    },
    {
      title: "Payment Method",
      align: "center",
      dataIndex: "payMode",
      width: 135,
      render: (value) => {
        switch (value) {
          case "Bank":
            return (
              <Tag color="cyan" style={{ fontSize: 13, padding: "2px 05px" }}>
                Bank
              </Tag>
            )
          case "Cash":
            return (
              <Tag color="magenta" style={{ fontSize: 13, padding: "2px 05px" }}>
                Cash
              </Tag>
            )
          default:
            return value;
        }
      },
      filterIcon: (filtered: boolean) => (
        <FilterOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div className="custom-filter-dropdown" style={{ padding: 10 }}>
          <Checkbox
            checked={selectedKeys.includes("Bank")}
            onChange={() => setSelectedKeys(selectedKeys.includes("Bank") ? [] : ["Bank"])}
          >
            <span style={{ color: "blue", fontSize: 14 }}>Bank</span>
          </Checkbox>
          <Checkbox
            checked={selectedKeys.includes("Cash")}
            onChange={() => setSelectedKeys(selectedKeys.includes("Cash") ? [] : ["Cash"])}
          >
            <span style={{ color: "magenta", fontSize: 14 }}>Cash</span>
          </Checkbox>
          <div className="custom-filter-dropdown-btns" style={{ marginTop: 10 }}>
            <Button
              onClick={() => {
                clearFilters && clearFilters();
                confirm();
              }}
              className="custom-reset-button"
            >
              Reset
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: 10 }}
              onClick={() => confirm()}
              className="custom-ok-button"
            >
              OK
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => record.payMode === value,
    },

    // {
    //   title: "Current State",
    //   width: 100,
    //   dataIndex: "currentState"
    // },
    // {
    //   title: "Current Pincode",
    //   width: 100,
    //   dataIndex: "currentPincode"
    // },
    // {
    //   title: "Permanent Address",
    //   width: 100,
    //   dataIndex: "permanentAddress"
    // },
    // {
    //   title: "Permanent State",
    //   width: 100,
    //   dataIndex: "permanentState"
    // },
    // {
    //   title: "Permanent Pincode",
    //   width: 100,
    //   dataIndex: "permanentPincode"
    // },

    // {
    //   title: "Provident Fund No.",
    //   width: 100,
    //   dataIndex: "pfNo"
    // },
    {
      title: "ESIC Number",
      width: 120,
      dataIndex: "esicNo",
      ...getColumnSearchProps("esicNo", "ESIC Number")
    },
    // {
    //   title: "Bank Name",
    //   width: 100,
    //   dataIndex: "bankName"
    // },
    {
      title: "Bank Account Number",
      width: 120,
      dataIndex: "bankAcNo",
      ...getColumnSearchProps("bankAcNo", "Bank Account Number")
    },
    {
      title: "Bank IFSC Code",
      width: 130,
      align: "center",
      dataIndex: "bankIfscCode",
      ...getColumnSearchProps("bankIfscCode", "Bank IFSC Code")
    },
    {
      title: "Nominee",
      width: 100,
      dataIndex: "nominee",
      ...getColumnSearchProps("nominee", "Nominee")
    },
    {
      title: "Reporting Manager",
      width: 150,
      align: "center",
      dataIndex: "reportingManagerName",
      ...getColumnSearchProps("reportingManagerName", "Reporting Manager")
    },
    {
      title: "Date Of Relieving ",
      dataIndex: "dateOfReliving",
      width: 120,
      align: "center",
      render: (date: string) => (date ? daysjs(date).format("DD/MM/YYYY") : ""),
      ...getColumnSearchPropsDateOfBirth('dateOfReliving', 'Date Of Relieving'),
    },
    {
      title: "Reason Of Relieving",
      width: 140,
      align: "center",
      dataIndex: "reasonOfReliving",
      ...getColumnSearchPropsDateOfBirth('reasonOfReliving', 'Reason Of Relieving'),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      align: "center",
      width: 120,
      render: (value) => {
        switch (value) {
          case "M":
            return (
              <Tag color="cyan" style={{ fontSize: 13, padding: "2px 05px" }}>
                Male
              </Tag>
            )
          case "F":
            return (
              <Tag color="magenta" style={{ fontSize: 13, padding: "2px 05px" }}>
                Female
              </Tag>
            )
          default:
            return value;
        }
      },
      filterIcon: (filtered: boolean) => (
        <FilterOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div className="custom-filter-dropdown" style={{ padding: 10 }}>
          <Checkbox
            checked={selectedKeys.includes("M")}
            onChange={() => setSelectedKeys(selectedKeys.includes("M") ? [] : ["M"])}
          >
            <span style={{ color: "blue", fontSize: 14 }}>Male</span>
          </Checkbox>
          <Checkbox
            checked={selectedKeys.includes("F")}
            onChange={() => setSelectedKeys(selectedKeys.includes("F") ? [] : ["F"])}
          >
            <span style={{ color: "magenta", fontSize: 14 }}>Female</span>
          </Checkbox>
          <div className="custom-filter-dropdown-btns" style={{ marginTop: 10 }}>
            <Button
              onClick={() => {
                clearFilters && clearFilters();
                confirm();
              }}
              className="custom-reset-button"
            >
              Reset
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: 10 }}
              onClick={() => confirm()}
              className="custom-ok-button"
            >
              OK
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      fixed: 'right',
      align: "center",
      width: 110,
      render(isActive) {
        return isActive === 1 ? (
          <Tag icon={<CheckCircleOutlined />} color="#87d068">
            Active
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="#f50">
            Inactive
          </Tag>
        );
      }
      // ...getColumnSearchProps("isActive"),
      // render: (isActive, rowData) => (
      //   <>
      //     {isActive ? (
      //       <Tag icon={<CheckCircleOutlined />} color="#87d068">
      //         Active
      //       </Tag>
      //     ) : (
      //       <Tag icon={<CloseCircleOutlined />} color="#f50">
      //         Inactive
      //       </Tag>
      //     )}
      //   </>
      // ),
      // filterIcon: (filtered: boolean) => (
      //   <FilterOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      // ),
      // filterDropdown: ({
      //   setSelectedKeys,
      //   selectedKeys,
      //   confirm,
      //   clearFilters,
      // }: any) => (
      //   <div
      //     className="custom-filter-dropdown"
      //     style={{ flexDirection: "row", marginLeft: 10 }}
      //   >
      //     <Checkbox
      //       checked={selectedKeys.includes('Active')}
      //       onChange={() =>
      //         setSelectedKeys(
      //           selectedKeys.includes('Active') ? [] : ['Active']
      //         )
      //       }
      //     >
      //       <span style={{ color: "green" }}>Active</span>
      //     </Checkbox>
      //     <Checkbox
      //       checked={selectedKeys.includes('Inactive')}
      //       onChange={() =>
      //         setSelectedKeys(
      //           selectedKeys.includes('Inactive') ? [] : ['Inactive']
      //         )
      //       }
      //     >
      //       <span style={{ color: "red" }}>Inactive</span>
      //     </Checkbox>
      //     <div className="custom-filter-dropdown-btns">
      //       <Button
      //         onClick={() => {
      //           handleReset(clearFilters);
      //           confirm();
      //         }}
      //         className="custom-reset-button"
      //       >
      //         Reset
      //       </Button>
      //       <Button
      //         type="primary"
      //         style={{ margin: 10 }}
      //         onClick={() => confirm()}
      //         className="custom-ok-button"
      //       >
      //         OK
      //       </Button>
      //     </div>
      //   </div>
      // ),
      // onFilter: (value, record) => {
      //   if (typeof value === 'string') {
      //     const status = record.isActive ? 'Active' : 'Inactive';
      //     return value === status;
      //   }
      //   return false;
      // },
    },
    {
      title: "Created Date",
      width: 110,
      dataIndex: "createdAt",
      align: "center",
      render: (text, record) =>
        // `${dayjs(record.createdAt).format("DD-MM-YYYY")} - ${moment.utc(record.createdAt).format("HH:mm")}`,
        `${dayjs(record.createdAt).format("DD-MM-YYYY")}`,
    },
    {
      title: (
        <>
          Actions
          {selectedRows.length > 0 && (
            <>
              <Button onClick={() => bulkActiveInactive(true)} type="primary">
                Active
              </Button>
              <Button
                onClick={() => bulkActiveInactive(false)}
                style={{ marginLeft: 5 }}
                danger
                variant="outlined"
              >
                Inactive
              </Button>
            </>
          )}
        </>
      ),
      dataIndex: "action",
      fixed: "right",
      align: "center",
      width: 300,
      render: (text, rowData) => {
        const employeeData = employeeFileData?.find(
          (emp) => emp.employeeCode === rowData.employeeCode
        );

        const file = employeeData?.employeeIdProofs?.[0]?.file;
        const experienceFile = employeeData?.employeeExperienceDetails?.[0]?.file;
        const idProffFileURL = file ? file instanceof File ? URL.createObjectURL(file) : `${config.ID_PROOF_UPLOAD_URL}/${encodeURIComponent(file)}` : null;
        const experienceFileURL = experienceFile ? experienceFile instanceof File ? URL.createObjectURL(experienceFile) : `${config.EXPERIENCE_PROOF_UPLOAD_URL}/${encodeURIComponent(experienceFile)}` : null;
        const handlePreview = (type) => {
          if (type === 'ID' && idProffFileURL) {
            setPreviewIdProffFile(idProffFileURL);
            setPreviewExperienceFile(null);
          } else if (type === 'Experience' && experienceFileURL) {
            setPreviewExperienceFile(experienceFileURL);
            setPreviewIdProffFile(null);
          }
          setOpenPopover(true)
          setIsModalOpen(true);
        };

        const handleIdProffDownload = async (filePath, isIdProof) => {
          if (!filePath) {
            console.error("Download failed: No Is Proff path provided.");
            return;
          }

          const baseUrl = isIdProof
            ? config.ID_PROOF_UPLOAD_URL
            : null;

          filePath.split(",").forEach(async (res) => {
            if (res) {
              setTimeout(async () => {
                try {
                  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
                  const cleanRes = res.replace(/^\/+/, "");
                  const encodedFileName = encodeURIComponent(cleanRes);
                  const fileUrl = `${cleanBaseUrl}/${encodedFileName}`;
                  const headResponse = await fetch(fileUrl, { method: "HEAD" });
                  if (!headResponse.ok) {
                    console.error(`🚨 File not found at URL: ${fileUrl}`);
                    return;
                  }
                  const response = await fetch(fileUrl);
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  const blob = await response.blob();
                  const fileType = blob.type || "application/octet-stream";
                  const fileExtension = cleanRes.match(/\.(pdf|PDF|jpg|JPG|jpeg|JPEG|png|PNG)$/i) ? cleanRes.split('.').pop().toLowerCase() : fileType.includes("pdf") ? "pdf" : fileType.includes("png") ? "png" : "jpg";
                  const finalFileName = cleanRes.match(/\.(pdf|PDF|jpg|JPG|jpeg|JPEG|png|PNG)$/i)
                    ? cleanRes
                    : `${cleanRes}.${fileExtension}`;
                  const blobUrl = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = blobUrl;
                  link.download = finalFileName;
                  link.style.display = "none";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(blobUrl);
                  console.log(`Download successful: ${finalFileName}`);
                } catch (error) {
                  console.error(`Download failed for ${res}:`, error);
                }
              }, 100);
            }
            setOpenPopover(true);
          });
        };

        const handleExperienceDownload = async (filePath, isExperience) => {
          if (!filePath) {
            console.error("Download failed: No Experiecne File path provided.");
            return;
          }

          const baseUrl = isExperience
            ? config.EXPERIENCE_PROOF_UPLOAD_URL
            : null;

          filePath.split(",").forEach(async (res) => {
            if (res) {
              setTimeout(async () => {
                try {
                  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
                  const cleanRes = res.replace(/^\/+/, "");
                  const encodedFileName = encodeURIComponent(cleanRes);
                  const fileUrl = `${cleanBaseUrl}/${encodedFileName}`;
                  const headResponse = await fetch(fileUrl, { method: "HEAD" });
                  if (!headResponse.ok) {
                    console.error(`🚨 File not found at URL: ${fileUrl}`);
                    return;
                  }
                  const response = await fetch(fileUrl);
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  const blob = await response.blob();
                  const fileType = blob.type || "application/octet-stream";
                  const fileExtension = cleanRes.match(/\.(pdf|PDF|jpg|JPG|jpeg|JPEG|png|PNG)$/i) ? cleanRes.split('.').pop().toLowerCase() : fileType.includes("pdf") ? "pdf" : fileType.includes("png") ? "png" : "jpg";
                  const finalFileName = cleanRes.match(/\.(pdf|PDF|jpg|JPG|jpeg|JPEG|png|PNG)$/i)
                    ? cleanRes
                    : `${cleanRes}.${fileExtension}`;
                  const blobUrl = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = blobUrl;
                  link.download = finalFileName;
                  link.style.display = "none";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(blobUrl);
                  console.log(`Download successful: ${finalFileName}`);
                } catch (error) {
                  console.error(`Download failed for ${res}:`, error);
                }
              }, 100);
            }
            setOpenPopover(true);
          });
        };

        return (
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {rowData.isActive ? (
              <Tooltip title="Edit Employee">
                <Button style={{ color: "#000", cursor: "pointer", borderColor: "black" }}>
                  <LiaUserEditSolid
                    className="editSamplTypeIcon"
                    onClick={() => editEmployee(rowData)}
                    style={{
                      fontSize: "20px",
                      cursor: "pointer",
                      display: SequenceUtils.fetchViewAccessScopes(
                        scopes,
                        ScopesEnum.Update
                      ),
                    }}
                  />
                </Button>
              </Tooltip>
            ) : null}

            <Button style={{ color: "#000", cursor: "pointer", borderColor: "black" }}>
              <Popover
                content={
                  <><Card style={{ width: 240 }}>
                    {employeeData ? (
                      <>
                        <Flex align="center" gap={10}>
                          <p style={{ width: 90, margin: 0, fontWeight: 500, textAlign: "right" }}>ID Proof :</p>
                          <Flex gap={10}>
                            {file ? (
                              <>
                                <Tooltip title="View">
                                  <Button style={{ width: "30px", borderColor: "black" }} onClick={() => handlePreview('ID')}>
                                    <EyeOutlined
                                      style={{ fontSize: "15px", color: "#000", cursor: "pointer" }}
                                    />
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Download">
                                  <Button style={{ width: "30px", borderColor: "black" }} onClick={() => handleIdProffDownload(file, true)}>
                                    <DownloadOutlined
                                      style={{ fontSize: "15px", color: "#000", cursor: "pointer" }}

                                    />
                                  </Button>
                                </Tooltip>
                              </>
                            ) : (
                              <p style={{ margin: 0, color: "#888" }}>No File</p>
                            )}
                          </Flex>
                        </Flex><br />
                        <Flex align="center" gap={10}>
                          <p style={{ width: 90, margin: 0, fontWeight: 500, textAlign: "right" }}>Experience :</p>
                          <Flex gap={10}>
                            {experienceFile ? (
                              <>
                                <Tooltip title="View">
                                  <Button style={{ width: "30px", borderColor: "black" }} onClick={() => handlePreview('Experience')}>
                                    <EyeOutlined
                                      style={{ fontSize: "15px", color: "#000", cursor: "pointer" }}

                                    />
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Download">
                                  <Button style={{ width: "30px", borderColor: "black" }} onClick={() => handleExperienceDownload(experienceFile, true)}>
                                    <DownloadOutlined
                                      style={{ fontSize: "15px", color: "#000", cursor: "pointer" }}

                                    />
                                  </Button>
                                </Tooltip>
                              </>
                            ) : (
                              <p style={{ margin: 0, color: "#888" }}>No File</p>
                            )}
                          </Flex>
                        </Flex>
                      </>
                    ) : (
                      <p style={{ margin: 0, textAlign: "center", color: "#888" }}>No Data Found</p>
                    )}<br />
                    <Flex gap={10}>
                      <p style={{ width: 90, margin: 0, fontWeight: 500, textAlign: "right" }}>Joining Form :</p><Button style={{ width: "30px", borderColor: "black" }} onClick={() => handleClickedJoinigForm(rowData.id)} ><EyeOutlined style={{ fontSize: "15px", color: "#000", cursor: "pointer" }} /></Button>
                    </Flex><br />

                    <Flex gap={10}>
                      <p style={{ width: 90, margin: 0, fontWeight: 500, textAlign: "right" }}>Full & Final Settlement :</p><Button style={{ width: "30px", borderColor: "black" }} onClick={() => handleClickedFullAndFinalForm(rowData.id)} ><EyeOutlined style={{ fontSize: "15px", color: "#000", cursor: "pointer" }} /></Button>
                    </Flex><br />

                    <Flex gap={10}>
                      <p style={{ width: 90, margin: 0, fontWeight: 500, textAlign: "right" }}>Exit Form :</p><Button style={{ width: "30px", borderColor: "black" }} onClick={() => handleClickedExitForm(rowData.id)}><EyeOutlined style={{ fontSize: "15px", color: "#000", cursor: "pointer" }} /></Button>
                    </Flex><br />

                    <Flex gap={10}>
                      <p style={{ width: 90, margin: 0, fontWeight: 500, textAlign: "right" }}>Offer Letter :</p><Button style={{ width: "30px", borderColor: "black" }} onClick={() => handleClickedOfferLetterForm(rowData.id)}><EyeOutlined style={{ fontSize: "15px", color: "#000", cursor: "pointer" }} /></Button>
                    </Flex><br />

                    <Flex gap={10}>
                      <p style={{ width: 90, margin: 0, fontWeight: 500, textAlign: "right" }}>Experience Form :</p><Button style={{ width: "30px", borderColor: "black" }} onClick={() => handleClickedExperienceForm(rowData.id)}><EyeOutlined style={{ fontSize: "15px", color: "#000", cursor: "pointer" }} /></Button>
                    </Flex><br />

                    <Flex gap={10}>
                      <p style={{ width: 90, margin: 0, fontWeight: 500, textAlign: "right" }}>Certificate Form:</p><Button style={{ width: "30px", borderColor: "black" }} onClick={() => handleClickedCertificateForm(rowData.id)}><EyeOutlined style={{ fontSize: "15px", color: "#000", cursor: "pointer" }} /></Button>
                    </Flex><br />

                    <Flex gap={10}>
                      <p style={{ width: 90, margin: 0, fontWeight: 500, textAlign: "right" }}>Releving Form :</p><Button style={{ width: "30px", borderColor: "black" }} onClick={() => handleClickedRelevingForm(rowData.id)}><EyeOutlined style={{ fontSize: "15px", color: "#000", cursor: "pointer" }} /></Button>
                    </Flex><br />

                    <Flex gap={10}>
                      <p style={{ width: 90, margin: 0, fontWeight: 500, textAlign: "right" }}>Payslip :</p><Button style={{ width: "30px", borderColor: "black" }} onClick={() => { scopes.includes(ScopesEnum.Employee) ? navigate(`/payslip-generation?${rowData.employeeId}-${rowData.branchId}`) : navigate(`/payslip-generation?${rowData.employeeId}-${rowData.branchId}`) }}><EyeOutlined style={{ fontSize: "15px", color: "#000", cursor: "pointer" }} /></Button>
                    </Flex><br />
                  </Card>
                  </>
                }
                placement="left"
                trigger="click"
                open={openPopover === rowData.employeeCode}
                onOpenChange={(visible) => setOpenPopover(visible ? rowData.employeeCode : null)}
              >
                <Tooltip title="View Files">
                  <FolderOpenOutlined style={{ fontSize: "19px", cursor: "pointer", borderColor: "black" }} />
                </Tooltip>

              </Popover>
            </Button>

            {/* <Tooltip title="View Leaves">
              <Popover trigger="click" placement="left" title={'Leave Balance'}
                content={
                  <><Card style={{ maxWidth: '400px' }}>
                    <Table
                      columns={Leavecolumns}
                      bordered
                      size="small"
                      dataSource={leaveAllocations}
                      pagination={false}
                    />
                  </Card>
                  </>
                }
                onOpenChange={(visible) => getAllLeaveAllocationsData(rowData.employeeCode)}
              >
                <Button style={{ color: "#000", cursor: "pointer", borderColor: "black" }}>
                  <ScheduleOutlined onClick={() => { }} style={{ fontSize: "15px", cursor: "pointer" }} />
                </Button>
              </Popover>
            </Tooltip> */}

            <Tooltip title="View Leaves">
              <Button style={{ color: "#000", cursor: "pointer", borderColor: "black" }}>
                <ScheduleOutlined onClick={() => { scopes.includes(ScopesEnum.Employee) ? navigate(`/employee-leave-balance?${rowData.employeeId}-${rowData.branchId}`) : navigate(`/worker-leave-balance?${rowData.employeeId}-${rowData.branchId}`) }} style={{ fontSize: "15px", cursor: "pointer" }} />
              </Button>
            </Tooltip>


            {/* <Tooltip title="Update RM">
              <Button style={{ color: "#000", cursor: "pointer", borderColor: "black" }}>
                <FormOutlined onClick={() => {
                  setFeildRepoManager(rowData.reportingManager),
                    setSelectedEmployeeCode(rowData.employeeCode),
                    setIsOpenModal(true)
                }} style={{ fontSize: "15px", cursor: "pointer" }} />
              </Button>
            </Tooltip> */}

            {rowData.isActive ? <Tooltip title="Update RM">
              <Button style={{ color: "#000", cursor: "pointer", borderColor: "black" }}>
                <FormOutlined onClick={() => { navigate(`/employee-rm-update?${rowData.employeeId}-${rowData.branchId}`) }} style={{ fontSize: "15px", cursor: "pointer" }} />
              </Button>
            </Tooltip> : <></>}

            {rowData.isActive ? (
              <Tooltip title="Employee Releasing">
                <Button style={{ color: "#000", cursor: "pointer", borderColor: "black" }}>
                  <UserDeleteOutlined
                    onClick={() => editadaectiveEmploee(rowData)}
                    style={{ fontSize: "15px", cursor: "pointer" }}
                  />
                </Button>
              </Tooltip>
            ) : null}

            <Popconfirm
              onConfirm={() => activateAndDeactive(rowData)}
              title={
                rowData.isActive
                  ? "Are you sure to Deactivate?"
                  : "Are you sure to Activate?"
              }
            >
              <Switch
                size="small"
                disabled={SequenceUtils.fetchVisibleAccessScopes(
                  scopes,
                  ScopesEnum.Delete
                )}
                className={
                  rowData.isActive ? "toggle-activated" : "toggle-deactivated"
                }
                checkedChildren={<RightSquareOutlined />}
                unCheckedChildren={<RightSquareOutlined />}
                checked={rowData.isActive}
              />
            </Popconfirm>

          </span>

        );
      },
    }
  ];

  return (
    <>
      <Form form={form} layout="vertical">
        <Row className="row">
          <div className="card total-count">
            <div className="title">
            {scopes.includes(ScopesEnum.Employee) ? `Total Employees: ${totalCount}` : `Total Workers: ${totalCount}`}
            </div>
          </div>
          <div className="card total-active">
            <div className="title">
              {scopes.includes(ScopesEnum.Employee) ? `Active: ${employeesTypeCount}` : `Active: ${workersTypeCount}`}
            </div>
          </div>

        </Row>
        <br />
        {employeeData.length > 0 ?
          <> <Table
            // rowKey={(record) => record.employeeId}
            // rowSelection={rowSelection}
            loading={loading}
            columns={columns}
            bordered
            size="small"
            dataSource={employeeData}
            scroll={{ y: 'calc(70vh - 100px)' }}
            pagination={false}
          /></> : <></>}

        <Modal
          open={modalVisible}
          // title={isUpdate ? 'Edit Employee' : 'Add Employee'}
          footer={null}
          onCancel={closeModal}
          width={'90%'}
        >
          {selectedEmployeeData && (
            <EmployeeForm
              employeeData={selectedEmployeeData}
              isUpdate={isUpdate}
              closeForm={closeModal}
              getAllEmployeeData={getEmployeeData}
            />
          )}
        </Modal>

        <Modal title={"Employee Resingation Reasons"}
          open={modalVisibles}
          onCancel={closeModals}
          footer={null}
          width="60%"
        >
          <EmployeeDeactiveForm
            employeeData={selectedEmployeeData}
            closeForm={closeModals}
            getAllEmployeeData={getEmployeeData}
          />
        </Modal>


        <Modal open={isModalOpen} onCancel={handleCancel} footer={null} width="70vw" style={{ marginBottom: "150px" }}>
          {previewIdProffFile && isPDF(previewIdProffFile) ? (
            <iframe
              src={previewIdProffFile}
              style={{ width: '100%', height: '600px', borderRadius: '8px' }}
              title="ID Proof PDF Preview"
            />
          ) : previewIdProffFile ? (
            <Image
              src={previewIdProffFile}
              alt="ID Proof Preview"
              style={{ width: "115%", height: '600px', borderRadius: '8px' }}
            />
          ) : previewExperienceFile && isPDF(previewExperienceFile) ? (
            <iframe
              src={previewExperienceFile}
              style={{ width: '100%', height: '600px', borderRadius: '8px' }}
              title="Experience PDF Preview"
            />
          ) : previewExperienceFile ? (
            <Image
              src={previewExperienceFile}
              alt="Experience File Preview"
              style={{ width: "115%", borderRadius: '8px' }}
            />
          ) : (
            <p>No File to Preview</p>
          )}
        </Modal>


        <Modal open={isJoiningFormOpen} onCancel={handleJoiningFormClose} width={1000} footer={null}>
          <EmployeeJoiningForm rec={joiningRecord} />
        </Modal>

        <Modal open={isFullFinalRecordFormOpen} onCancel={handleFullAndFinalFormClose} width={1000} footer={null}>
          <FinalSettlementtPdf rec={fullFinalRecord} />
        </Modal>

        <Modal open={isExitFormOpen} onCancel={handleExitFormClose} width={1000} footer={null}>
          <EmployeeExitDocumentDataPdf rec={exitRecord} />
        </Modal>

        <Modal open={isOfferLetterFormOpen} onCancel={handleOfferLetterFormClose} width={1000} footer={null}>
          <SampleOfferLetterPdf rec={isOfferLetterRecord} payroll={undefined} />
        </Modal>

        <Modal open={isExperienceFormOpen} onCancel={handleExperienceFormClose} width={1000} footer={null}>
          <ExperienceForm rec={isExperienceRecord} />
        </Modal>

        <Modal open={isCertificateFormOpen} onCancel={handleCertificateFormClose} width={1000} footer={null}>
          <CertificateEmployee rec={isCertificateRecord} />
        </Modal>

        <Modal open={isRelivingFormOpen} onCancel={handleRelevingFormClose} width={1000} footer={null}>
          <CertificateEmployee rec={isRelivingRecord} />
        </Modal>


        <Modal
          title={"Update Reporting Manager"}
          open={isOpenModal}
          onCancel={handleCloseOpenModal}
          width={400}
          footer={null}
        >
          <Col xs={12} sm={6} md={8} lg={12} xl={12}>
            <Form.Item label="Reporting Manager" name="reportingManager" initialValue={feildRepoManager}>
              <Select
                style={{ width: 300 }}
                showSearch
                defaultValue={feildRepoManager}
                allowClear
                value={selectedManager}
                onChange={(value) => setSelectedManager(value)}
                filterOption={(input, option) =>
                  (option?.children ?? '').toString().toLowerCase().includes(input.toLowerCase())
                }
              >
                {selectedEmployee.map((employee) => (
                  <Option key={employee.id} value={employee.id}>
                    {employee.employeeCode} - {employee.employeeName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              onClick={() => { handleSubmitUpdate({ selectedManager: selectedManager }) }}
              type="primary"
              style={{ marginTop: "10px" }}
            >
              Update
            </Button>
          </Col>
        </Modal>
      </Form>
    </>
  );
}
export default EmployeeTableView