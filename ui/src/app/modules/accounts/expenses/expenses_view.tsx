import {
  DeleteTwoTone,
  DownloadOutlined,
  EyeOutlined,
  FileOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { AlertMessages, PaymentStatusEnum, PaymentTypeEnum } from '@hrexpert/shared-models';
import {
  configVariables,
  DesignationsService,
  EmployeeOnboardingService,
  ExpensesAganistService,
  ExpensesSharedService,
  ExpensesTypeService,
} from '@hrexpert/shared-services';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputRef,
  message,
  Modal,
  Popover,
  Row,
  Select,
  Space,
  Switch,
  Image,
  Table,
  TableColumnsType,
  TableColumnType,
  Tabs,
  Tooltip,
  Typography,
  Upload,
  Avatar,
  List,
  Card,
  Popconfirm
} from 'antd';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { BiExpandAlt } from 'react-icons/bi';
import { FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
type DataIndex = keyof DataType;

interface FileData {
  fileName: string;
  fileid: string;
  filePath: string;
  featuresRefNo: number
}

interface DataType {
  expenses_id: number;
  date_time: string;
  expensesAgainst: string;
  employeeName: string;
  branch: string;
  branchManager: string;
  expensesType: string;
  expensesCode: string;
  amount: number;
  paymentMode: string;
  referenceNo: string;
  paymentStatus: string;
  taxApplicable: boolean;
  approvedBy: string;
  remarks: string;
  created_date: string;
  filesData: FileData[];
}

const ExpensesView = () => {
  const [activeTab, setActiveTab] = useState('Cash');
  const [expenseAgainst, setExpenseAgainst] = useState<string>('Employee');
  const [expensesData, setExpensesData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DataType | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>('');
  const [employeeNames, setEmployeeNames] = useState<{ id: number; fullName: string }[]>([]);
  const [searchedColumn, setSearchedColumn] = useState<keyof DataType | null>(null);
  const [isDetailedView, setIsDetailedView] = useState(false);
  const [branchNames, setBranchNames] = useState<any[]>();
  const searchInput = useRef<InputRef>(null);
  const [expensesAgainst, setExpensesAgainst] = useState<{ expenseAgainstId: number; expenseAgainst: string }[]>([]);
  const [designations, setDesignations] = useState<{ id: number; name: string }[]>();
  const [expenseType, setExpenseType] = useState<{ expenseId: number; expenseType: string }[]>([]);
  const [selectedExpenseAgainst, setSelectedExpenseAgainst] = useState<string>("Employee");
  const [fileList, setFileList] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const expensesTypeSharedService = new ExpensesTypeService();
  const employeeOnboardingService = new EmployeeOnboardingService();
  const expensesSharedService = new ExpensesSharedService();
  const designationsService = new DesignationsService();
  const expensesAgainstService = new ExpensesAganistService();

  const fileRootPath = configVariables.EXPENSES_UPLOAD_FILES;

  useEffect(() => {
    getAllExpensesTypes();
    getAllEmployeeNames();
    getAllBarnchList();
    getAllDesignations();
    fetchExpensesAgainst();
    fetchExpensesData();
  }, []);

  const fetchExpensesData = async () => {
    setLoading(true);
    try {
      const response: DataType[] =
        await expensesSharedService.getAllExpenseDocuments();
      if (response) {
        console.log(response, 'Expenses Data');
        setExpensesData(response);
      } else {
        message.error('Failed to fetch expense documents');
      }
    } catch (error) {
      message.error('Error fetching expense documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchExpensesAgainst = async () => {
    try {
      const response = await expensesAgainstService.getExpensesAgainst();
      if (response && response.status) {
        const activeExpenses = response.data.filter((expense: any) => expense.isActive);
        setExpensesAgainst(activeExpenses || []);
      } else {
        message.error('Failed to fetch expenses Against data');
      }
    } catch (error) {
      message.error('Error fetching expenses Against data');
    }
  };

  const getAllEmployeeNames = async () => {
    try {
      const response = await employeeOnboardingService.getEmployeeNamesList();
      console.log('Fetched Employee Names:', response.data);

      if (response && Array.isArray(response)) {
        setEmployeeNames(response);
      } else {
        console.error('Error: Invalid response data', response);
      }
    } catch (error) {
      console.error('Failed to fetch employee names:', error);
    }
  };

  const getAllDesignations = async () => {
    try {
      const response = await designationsService.getDesignations();
      console.log('Fetched Designations:', response.data);
      if (response?.status && Array.isArray(response.data)) {
        setDesignations(response.data);
      } else {
        console.error("Error: Unexpected response format", response);
      }
    } catch (error) {
      console.error("Failed to fetch Designations:", error);
    }
  }

  const getAllBarnchList = async () => {
    try {
      const response = await employeeOnboardingService.getBranchNamesList();
      if (response && Array.isArray(response)) {
        setBranchNames(response)
      } else {
        console.error('Error: Invalid response data', response);
      }
    } catch (error) {
      console.error('Failed to fetch employee names:', error);
    }
  }

  const getAllExpensesTypes = async () => {
    try {
      const response = await expensesTypeSharedService.getExpensesType();
      console.log("Fetched Expense Types:", response.data);

      if (response?.data) {
        setExpenseType(response.data);
        console.log("Expense Types:", response.data);
      } else {
        console.error("Error: Invalid response data", response);
      }
    } catch (error) {
      console.error("Failed to fetch expense types:", error);
    }
  };

  const [selectedEmployee, setSelectedEmployee] = useState<any>('');

  const handleEmployeeChange = async (employeeName: string) => {
    try {
      const response = await employeeOnboardingService.getBranchAndRmByEmployee({ employeeName });
      setSelectedEmployee(employeeName);
      const updatedValues: any = { employeeName };
      if (Array.isArray(response) && response.length > 0) {
        const { branch_name, reportingManager } = response[0];
        updatedValues.branch = branch_name;
        updatedValues.branchManager = reportingManager;
      }
      form.setFieldsValue(updatedValues);
      setFormValues((prev) => ({ ...prev, ...updatedValues }));
    } catch (error) {
      console.error("Failed to fetch branch and reporting manager:", error);
    }
  };

  const handleDownload = (fileName: string) => {
    const fileUrl = fileRootPath + fileName;
    fetch(fileUrl)
      .then(response => {
        if (response.ok) {
          response.blob().then(blob => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${fileName}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        } else {
          message.error('Failed to download the file');
        }
      })
      .catch(error => {
        console.error('Error while downloading the file:', error);
        message.error('An error occurred while downloading the file');
      });
  };

  // const handleDownload = async (filePath: string, fileName: string) => {
  //   try {
  //     console.log(fileName, filePath, '-----------dfddsdfds------------');
  //     const response = await fetch(`${filePath}${fileName}`, {
  //       method: 'GET', cache: 'no-cache',
  //     });
  //     console.log(response, 'Response');
  //     if (!response.ok)
  //       throw new Error(`Failed to fetch file: ${response.statusText}`);
  //     const blob = await response.blob();
  //     const blobUrl = URL.createObjectURL(blob);
  //     const anchor = Object.assign(document.createElement('a'), {
  //       href: blobUrl, download: fileName,
  //     });
  //     anchor.click();
  //     URL.revokeObjectURL(blobUrl);
  //     message.success(`${fileName} downloaded successfully.`);
  //   } catch (error) {
  //     console.error('Download error:', error);
  //     message.error("Failed to download the file");
  //   }
  // };

  const formatDate = (dateString: string, dateFormat = 'DD-MM-YYYY') => {
    return dayjs(dateString).format(dateFormat);
  };

  const handleSearch = (
    selectedKeys: React.Key[],
    confirm: () => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0] as string);
    setSearchedColumn(dataIndex);
  };

  const handleNavigate = () => {
    navigate('/expenses-form');
  };

  const handleReset = (clearFilters?: () => void) => {
    clearFilters?.();
    setSearchText('');
  };

  const [formValues, setFormValues] = useState({ employeeName: "", branchManager: "", });

  const handleExpenseAgainstChange = (value: string) => {
    const updatedValues: any = { selectedExpenseAgainst: value };
    if (value === "Branch") {
      updatedValues.employeeName = " ";
      updatedValues.branchManager = "";
    } if (value === "Employee") {
      updatedValues.employeeName = selectedEmployee
    }
    form.setFieldsValue(updatedValues);
    setFormValues(updatedValues);
    setSelectedExpenseAgainst(value);
  };


  const handleExportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Expense Report');

      const headers = [
        'S.No', 'Date', 'Expenses Against', 'Employee Name', 'Branch', 'Branch Manager',
        'Expenses Type', 'Expense Code', 'Amount', 'Payment Mode', 'Reference No',
        'Payment Status', 'Tax Applicable', 'Approved By', 'Remarks'
      ];
      worksheet.addRow(headers);
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '8d99ae' },
        };
        // cell.border = {
        //   top: { style: 'thin' },
        //   left: { style: 'thin' },
        //   bottom: { style: 'thin' },
        //   right: { style: 'thin' },
        // };
      });

      worksheet.autoFilter = "A1: O1";

      const exportData = expensesData.map((item, index) => [
        index + 1,
        item.date_time ? moment(item.date_time).format('DD-MM-YYYY') : '',
        item.expensesAgainst || '',
        item.employeeName || '',
        item.branch || '',
        item.branchManager || '',
        item.expensesType || '',
        item.expensesCode || '',
        item.amount || '',
        item.paymentMode || '',
        item.referenceNo || '',
        item.paymentStatus || '',
        item.taxApplicable || '',
        item.approvedBy || '',
        item.remarks || '',
      ]);

      exportData.forEach((row) => {
        const addedRow = worksheet.addRow(row);
        addedRow.eachCell((cell) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });
      const columnWidths = [5, 15, 20, 20, 20, 20, 30, 40, 15, 20, 15, 15, 15, 20, 25];
      columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `Expenses_Report_${moment().format('YYYY-MM-DD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  const handleEdit = async (record: DataType) => {
    await fetchExpensesData();
    setCurrentDocument(record);
    console.log(record);
    form.setFieldsValue({
      ...record,
      date_time: dayjs(record.date_time),
      expenseType: record.expensesType
    });
    setIsModalVisible(true);
  };

  const fileHandling = async (res) => {
    try {
      const fileList = res.filePath?.fileList;
      if (!Array.isArray(fileList) || fileList.length === 0) {
        message.error("No files selected.");
        return;
      }
      const formData = new FormData();
      formData.append('id', `${res.expenses_id}`);
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('file', file.originFileObj);
        } else {
          console.warn("File object is missing");
        }
      });
      await expensesSharedService.updateExpenseFileUpload(formData);
      message.success("Files uploaded successfully");
    } catch (error) {
      AlertMessages.getErrorMessage("File not uploaded");
      console.error("File upload error:", error);
    }
  };

  const handleSubmit = async (values: any) => {
    if (currentDocument) {
      try {
        const updatedDocument = {
          ...currentDocument,
          ...values,
          date_time: values.date_time.format('YYYY-MM-DD'),
          employeeName: values.employeeName || formValues.employeeName,
          branchManager: values.branchManager || formValues.branchManager,
        };
        await expensesSharedService.updateDocument(updatedDocument);
        fileHandling(updatedDocument);
        await fetchExpensesData();
        handleModalClose();
      } catch (error) {
        message.error('Failed to update expenses');
      }
    }
  };


  const handleEditModalOpen = (record) => {
    setSelectedRecord(record);
    if (record?.filesData && record?.filesData.length > 0) {
      const formattedFiles = record.filesData.map(file => ({
        uid: file.fileid,
        name: file.fileName,
        url: file.fileUrl,
      }));
      setFileList(formattedFiles);
    } else {
      setFileList([]);
    }
  };

  const uploadImageProps = {
    multiple: false,
    onRemove: file => {
      setFileList([]);
    },
    beforeUpload: file => {
      event.preventDefault();
      if (!file.name.match(/\.(xlsx|xls|pdf|jpg|png|jpeg|doc|PDF|ppt|pptx|doc|docx|csv|zip|gif)$/)) {
        message.error("Only specific file types are allowed.");
        return false;
      }
      setFileList([file]);
      return false;
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    },
    fileList,
    showUploadList: false,
  };

  const handleFileDelete = async (fileid: string) => {
    try {
      const res = await expensesSharedService.removeUploadExpenseDocument(fileid);
      setCurrentDocument(prevDoc => ({
        ...prevDoc,
        filesData: prevDoc.filesData.filter(file => file.fileid !== fileid)
      }));

    } catch (error) {
      console.error("Delete error:", error);
      message.error("Something went wrong while deleting the file.");
    }
  };

  const filteredData = expensesData.filter(
    (expense) => expense.paymentMode === activeTab
  );

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    name: string
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 12 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${name}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value.toString()] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 12, display: 'block' }}
        />
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
            size="small"
            style={{ width: 90 }}
            onClick={() => {
              handleReset(clearFilters);
              confirm({ closeDropdown: true });
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      if (!record[dataIndex]) return false;
      let recordValue = record[dataIndex];
      if (dataIndex === "date_time") {
        recordValue = dayjs(record[dataIndex]).format("DD-MM-YYYY");
      }
      return recordValue.toString().toLowerCase().includes(value.toString().toLowerCase());
    },

    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => {
      let formattedText = text;
      if (dataIndex === 'created_date') {
        formattedText = formatDate(text);
      }

      const highlightText = (text) => {
        const lowerSearchText = searchText.toLowerCase();
        const regex = new RegExp((`${lowerSearchText}`), 'gi');
        const parts = text.toString().split(regex);
        return text ? (
          <span>
            {text
              .toString()
              .split(parts)
              .map((fragment, i) =>
                fragment.toLowerCase() === lowerSearchText ? (
                  <span
                    key={i}
                    style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}
                  >
                    {fragment}
                  </span>
                ) : (
                  fragment
                )
              )}
          </span>
        ) : (
          text
        );
      };

      return searchedColumn === dataIndex
        ? highlightText(formattedText)
        : formattedText;
    },
  });

  const initialColumns: any = [
    {
      title: 'S.No',
      key: 'index',
      render: (text, object, index) => (page - 1) * pageSize + (index + 1),
      width: 50,
    },
    {
      title: 'Date',
      dataIndex: 'date_time',
      key: 'date',
      ...getColumnSearchProps('date_time', 'Date'),
      render: (date: string) =>
        date ? dayjs(date).format('DD-MM-YYYY') : 'N/A',
    },
    {
      title: 'Expenses Against',
      dataIndex: 'expensesAgainst',
      key: 'expensesAgainst',
      ...getColumnSearchProps('expensesAgainst', 'Expenses Against'),
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      ...getColumnSearchProps('employeeName', 'Employee Name'),
      render: (text) => text ? text : "-"
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      ...getColumnSearchProps('branch', 'Branch'),
      render: (text) => text ? text : "-"
    },
    {
      title: 'Manager',
      dataIndex: 'branchManager',
      key: 'branchManager',
      ...getColumnSearchProps('branchManager', 'Manager'),
      render: (text) => text ? text : "-"
    },
    {
      title: 'Expense Type',
      dataIndex: 'expensesType',
      key: 'expensesType',
      ...getColumnSearchProps('expensesType', 'Expense Type'),
      render: (text) => text ? text : "-"
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      ...getColumnSearchProps('amount', 'Amount'),
      render: (text) => text ? text : "-"
    },
    {
      title: 'Payment Mode',
      dataIndex: 'paymentMode',
      key: 'paymentMode',
      ...getColumnSearchProps('paymentMode', 'Payment Mode'),
      render: (text) => text ? text : "-"
    },
    {
      title: 'Uploaded Files',
      dataIndex: 'filesData',
      key: 'files',
      render: (filesData: FileData[]) => {
        if (!filesData || filesData.length === 0) {
          return <span>No files available</span>;
        }

        const firstFile = filesData[0];
        const remainingFiles = filesData.slice(1);

        return remainingFiles.length > 0 ? (
          <Popover
            content={
              <div>
                {filesData.map((file) => (
                  <div key={file.fileid} style={{ marginBottom: '5px' }}>
                    <span style={{ fontSize: '14px' }}>{file.fileName}</span>
                  </div>
                ))}
              </div>
            }
            title="Uploaded Files List"
            trigger="hover"
          >
            <span>
              {firstFile.fileName}... ({remainingFiles.length} more)
            </span>
          </Popover>
        ) : (
          <span>{firstFile.fileName}</span>
        );
      },
    },
  ]

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Expense Code',
      dataIndex: 'expensesCode',
      key: 'expensesCode',
      ...getColumnSearchProps('expensesCode', 'Expense Code'),
      render: (text) => text ? text : "-"
    },

    {
      title: 'Ref Number',
      dataIndex: 'referenceNo',
      key: 'refNumber',
      ...getColumnSearchProps('referenceNo', 'Ref Number'),
      render: (text) => text ? text : "-"
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      ...getColumnSearchProps('paymentStatus', 'Payment Status'),
      render: (text) => text ? text : "-"
    },
    {
      title: 'Tax Applicable',
      dataIndex: 'taxApplicable',
      key: 'taxApplicable',
      render: (tax: boolean) => (tax ? 'Yes' : 'No'),
      ...getColumnSearchProps('taxApplicable', 'Tax Applicable'),
    },
    {
      title: 'Approved By',
      dataIndex: 'approvedBy',
      key: 'approved',
      ...getColumnSearchProps('approvedBy', 'Approved By'),
      render: (text) => text ? text : "-"
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      ...getColumnSearchProps('remarks', 'Remarks'),
      render: (text) => text ? text : "-"
    },
  ];

  const actionColumn = {
    title: 'Actions',
    key: 'actions',
    align: 'center' as 'center',
    width: '120px',
    render: (_, record) => {
      const filesData = record.filesData || [];

      const fileActionsContent = (
        <div>
          {filesData.map((file) => {
            const fileUrl = `${fileRootPath}${file.fileName}`;
            const fileUrl1 = `${fileRootPath}`;
            const fileExtension = fileUrl.split('.').pop()?.toLowerCase();

            return (
              <div
                key={file.fileid}
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: '5px',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '150px',
                  }}
                  title={file.fileName}
                >
                  {file.fileName.length > 20
                    ? `${file.fileName.substring(0, 20)}...`
                    : file.fileName}
                </p>

                <div style={{ display: 'flex', gap: '5px' }}>
                  <Tooltip title="View File" color="purple">
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => {
                        if (!fileExtension) {
                          message.error('File extension is not available');
                          return;
                        }
                        const googleSupportedExtensions = [
                          'docx', 'odt', 'rtf', 'txt', 'html', 'md', 'xls', 'xlsx', 'ods', 'csv',
                        ];
                        if (googleSupportedExtensions.includes(fileExtension)) {
                          const viewerUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(fileUrl)}`;
                          window.open(viewerUrl, '_blank');
                        } else {
                          window.open(fileUrl, '_blank');
                        }
                      }}
                      style={{
                        border: '1px solid black',
                        backgroundColor: 'transparent',
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Download File" color="purple">
                    <Button
                      icon={<DownloadOutlined />}
                      style={{
                        border: '1px solid black',
                        backgroundColor: 'transparent',
                      }}
                      onClick={() => handleDownload(file.fileName)}
                    />
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      );

      return (
        <>
          <Popover
            content={fileActionsContent}
            trigger="hover"
            overlayStyle={{ width: '250px' }}
            placement="top"
          >
            <Button
              size="middle"
              icon={<FolderOpenOutlined size={18} />}
              style={{
                marginRight: '10px',
                borderColor: 'black'
              }}
            />
          </Popover>

          <Tooltip title="Edit Document" color="purple">
            <Button
              size="middle"
              onClick={() => handleEdit(record)}
              icon={<FiEdit size={14} />}
              style={{
                borderColor: 'black'
              }}
            />
          </Tooltip>
        </>
      );
    },
  };

  const handleModalClose = () => {
    setIsModalVisible(false)
    fetchExpensesData();
  }

  const mergedColumns = isDetailedView
    ? [...initialColumns, ...columns, actionColumn]
    : [...initialColumns, actionColumn];

  return (
    <PageContainer
      title="View Expenses"
      extra={[
        <>
          <span style={{ fontWeight: 'bold', color: '#bc6c25' }}>Detailed View </span>
          <Switch
            checked={isDetailedView}
            style={{ marginRight: '10px' }}
            onChange={(checked) => setIsDetailedView(checked)}
          />
          <Button key="add" style={{ marginRight: 10, borderColor: '#1677ff', color: '#1677ff' }} onClick={handleNavigate}>
            Add Expense
          </Button>
          <Button key="export" style={{ marginRight: 10, borderColor: '#22f534', color: 'green', borderStyle: 'dashed', fontWeight: 'bold' }} onClick={handleExportToExcel}>
            Get Excel
          </Button>
        </>
      ]}
    >
      <Tabs defaultActiveKey="Cash" onChange={setActiveTab}>
        <TabPane tab="Cash" key="Cash">
          <Table
            dataSource={filteredData}
            columns={mergedColumns}
            rowKey="expenses_id"
            pagination={{
              current: page,
              pageSize: pageSize,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            scroll={{ x: true }}
            loading={loading}
          />
        </TabPane>
        <TabPane tab="Card" key="Card">
          <Table
            dataSource={filteredData}
            columns={mergedColumns}
            rowKey="expenses_id"
            pagination={{
              current: page,
              pageSize: pageSize,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            scroll={{ x: true }}
            loading={loading}
          />
        </TabPane>

        <TabPane tab="Bank" key="Bank">
          <Table
            dataSource={filteredData}
            columns={mergedColumns}
            rowKey="expenses_id"
            pagination={{
              current: page,
              pageSize: pageSize,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            scroll={{ x: true }}
            loading={loading}
          />
        </TabPane>
      </Tabs>
      {currentDocument && (
        <Modal
          title="Edit Expense"
          visible={isModalVisible}
          width={'60%'}
          onCancel={handleModalClose}
          footer={null}
          afterOpenChange={(open) => {
            if (open) {
              handleEditModalOpen(selectedRecord);
            }
          }}
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item name="date_time" label="Date">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Expenses Against"
                  name="expensesAgainst"
                  initialValue="Employee"
                  rules={[{ required: true, message: 'Expenses Against is required' }]}
                >
                  <Select
                    value={selectedExpenseAgainst}
                    onChange={handleExpenseAgainstChange}
                    placeholder="Select Expense Type"
                  >
                    {expensesAgainst.map((expense) => (
                      <Select.Option key={expense.expenseAgainstId} value={expense.expenseAgainst}>
                        {expense.expenseAgainst}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {selectedExpenseAgainst !== "Branch" && (
                <>
                  <Col span={8}>
                    <Form.Item label="Employee Name" name="employeeName">
                      <Select
                        value={selectedEmployee}
                        onChange={handleEmployeeChange}
                        allowClear
                        showSearch
                        placeholder="Select Employee Name"
                      >
                        {employeeNames.map((emp) => (
                          <Option key={emp.id} value={emp.fullName}>
                            {emp.fullName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="Manager" name="branchManager">
                      <Input placeholder="Enter Manager" />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col span={8}>
                <Form.Item label="Branch" name="branch">
                  <Select placeholder="Select Branch" allowClear showSearch>
                    {branchNames?.map((branch) => (
                      <Option key={branch.branch_id} value={branch.branch_name}>
                        {branch.branch_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>


              <Col span={8}>
                <Form.Item name="expenseType" label="Expense Type">
                  <Select style={{ width: '100%' }} placeholder="Select Expense Type">
                    {expenseType.map((expense) => (
                      <Option key={expense.expenseId} value={expense.expenseType}>
                        {expense.expenseType}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="amount" label="Amount">
                  <Input type="number" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Payment Mode" name="paymentMode">
                  <Select placeholder="Select Payment Mode">
                    {Object.values(PaymentTypeEnum).map((mode) => (
                      <Option key={mode} value={mode}>
                        {mode}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="referenceNo" label="Ref Number"
                  rules={[{ required: false, message: 'Ref Number is required' }, { pattern: /^[a-zA-Z0-9]+$/, message: 'Only letters and numbers are allowed' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Payment Status" name="paymentStatus">
                  <Select placeholder="Select Payment Status">
                    {Object.values(PaymentStatusEnum).map((status) => (
                      <Option key={status} value={status}>
                        {status}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="taxApplicable" label="Tax Applicable">
                  <Select>
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="approvedBy" label="Approved By">
                  <Select placeholder="Select Approved By">
                    {designations?.map((res) => (
                      <Option key={res.id} value={res.name}>
                        {res.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="remarks" label="Remarks">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="filesData"
              label="Files"
              rules={[{ required: false, message: 'Please Enter Remarks' }]}
            >
              <Row gutter={16} align="middle">
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: "bold" }}>Upload Files</span>}
                    name="filePath"
                  >
                    <Upload.Dragger    {...uploadImageProps} style={{ width: "100px", height: "100px", padding: "10px" }}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {fileList.length > 0 &&
                    fileList.map((file, index) => {
                      const fileType = file.name.split('.').pop().toLowerCase();

                      if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
                        // Image Preview
                        return (
                          <Image
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt="uploaded-preview"
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '10px',
                              border: '2px solid #f0f0f0',
                              marginRight: '10px',
                            }}
                            preview={true}
                          />
                        );
                      } else {
                        return (
                          <div key={index} style={{ marginBottom: '10px' }}>
                            <a
                              href={URL.createObjectURL(file)}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '5px 10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                textDecoration: 'none',
                                background: '#fafafa',
                                color: '#333',
                                width: 'fit-content'
                              }}
                            >
                              📄 {file.name}
                            </a>
                          </div>
                        );
                      }
                    })
                  }
                </Col>
              </Row>
            </Form.Item>

            <Card
              bordered={true}
              style={{
                maxHeight: '250px',
                overflowY: 'auto',
                borderRadius: '10px',
                padding: '10px',
                width: '100%',
                background: '#fafafa',
              }}
            >
              <List
                itemLayout="horizontal"
                dataSource={currentDocument?.filesData}
                renderItem={(item) => {
                  const isImage = item.fileName.match(/\.(jpg|jpeg|png|gif)$/i);
                  const isPDF = item.fileName.match(/\.pdf$/i);

                  return (
                    <List.Item
                      actions={[
                        <Popconfirm
                          title="Are you sure to delete this file?"
                          onConfirm={() => handleFileDelete(item.fileid)}
                        >
                          <Button>
                            <DeleteTwoTone />
                          </Button>
                        </Popconfirm>,
                      ]}
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          isImage ? (
                            <Avatar src={item.filePath} />
                          ) : isPDF ? (
                            <Avatar
                              src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                            />
                          ) : (
                            <Avatar icon={<FileOutlined />} />
                          )
                        }
                        title={
                          <a
                            href={item.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#1890ff", fontWeight: "500" }}
                          >
                            {item.fileName}
                          </a>
                        }
                      />
                    </List.Item>
                  );
                }}
              />

            </Card>


            <Row justify="end" gutter={16} style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
              <Col>
                <Button type="primary" htmlType="submit">Update</Button>
              </Col>
              <Col>
                <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </PageContainer>
  );
};

export default ExpensesView;