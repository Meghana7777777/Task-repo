import { DeleteTwoTone, DownloadOutlined, EyeOutlined, FileOutlined, FolderOpenOutlined, InboxOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Drawer, Form, Image, Input, InputRef, List, message, Modal, Popconfirm, Popover, Row, Select, Space, Table, TableColumnsType, TableColumnType, Tooltip, Typography, Upload } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { PageContainer } from '@ant-design/pro-layout';
import { AlertMessages, DocumentTypeEnum, DomainEnum, DomainModelDto } from '@hrexpert/shared-models';
import { configVariables, DocumentSharedService, DomainSharedService } from '@hrexpert/shared-services';
import dayjs from 'dayjs';
import { BiExpandAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

interface FileData {
    fileName: string;
    fileid: string;
    filePath: string;
    featuresReferenceNo: number;
}
interface DataType {
    document_id: number;
    domain: string;
    company: string;
    branch: string;
    file_id_unq: number;
    document_type: string;
    document_name: string;
    created_date: string;
    created_by: string;
    remarks: string;
    filesData: FileData[];
}
const { Title } = Typography;
type DataIndex = keyof DataType;
const { Option } = Select;

const KnowledgeRepositoryView = () => {
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const navigate = useNavigate();
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [filters, setFilters] = useState<{ type?: string; status?: string }>({
        type: '',
        status: '',
    });
    const [openFilterModal, setOpenFiltersModal] = useState<boolean>(false);

    // const fileRootPath = 'http://localhost:2000/api';
    // const fileRootPath = 'http://139.59.79.77:2000/api/hrexpert_dev/kr_upload_images'
    const fileRootPath = configVariables.KR_UPLOAD_IMAGES

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDocument, setCurrentDocument] = useState<DataType | null>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [selectedDomain, setselectedDomain] = useState<string>('All');
    const [selectedDocType, setselectedDocType] = useState<string>();
    const [domains, setDomains] = useState<DomainModelDto[]>([]);
    const [searchedColumn, setSearchedColumn] = useState<keyof DataType | null>(null);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const searchInput = useRef<InputRef>(null);
    const [fileList, setFileList] = useState<any[]>([]);
    const documentService = new DocumentSharedService();
    const domainService = new DomainSharedService();


    useEffect(() => {
        getDomains();
    }, [])

    const getDomains = async () => {
        try {
            const response = await domainService.getDomianType();
            if (response && response.status) {
                setDomains(response.data);
            } else {
                message.error('Failed to fetch domain data');
            }
        } catch (error) {
            message.error('Error fetching domain data');
        }
    }

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const documents = await documentService.getDocuments(filters);

            if (Array.isArray(documents)) {
                const sortedDocuments = documents.sort(
                    (a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
                );
                setData(sortedDocuments);

            } else {
                console.error('Invalid data format received:', documents);
                setData([]);
            }
        } catch (error) {
            message.error('Failed to fetch documents. Please try again.');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (filePath: string, fileName: string) => {
        try {
            console.log(fileName, filePath);
            const response = await fetch(`${filePath}${fileName}`, { method: 'GET', cache: 'no-cache' });

            console.log(response);
            if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const anchor = Object.assign(document.createElement('a'), { href: blobUrl, download: fileName });
            anchor.click();

            URL.revokeObjectURL(blobUrl);
            message.success(`${fileName} downloaded successfully.`);
        } catch (error) {
            console.error('Download error:', error);
            message.error(`Failed to download the file.`);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [filters]);


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

    const handleReset = (clearFilters?: () => void) => {
        clearFilters?.();
        setSearchText('');
    };


    const getColumnSearchProps = (
        dataIndex: DataIndex,
        name: string,
        customFilterFn?: (value: string, record: DataType) => boolean
    ): TableColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 12 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${name}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value.toString()] : [])}
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
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: customFilterFn
            ? customFilterFn
            : (value, record) =>
                record[dataIndex]
                    ? record[dataIndex].toString().toLowerCase().includes(value.toString().toLowerCase())
                    : false,
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
                if (!searchText) return text;
                const lowerSearchText = searchText.toLowerCase();
                const regex = new RegExp(`(${lowerSearchText})`, 'gi');
                return text ? (
                    <span>
                        {text
                            .toString()
                            .split(regex)
                            .map((fragment, i) =>
                                fragment.toLowerCase() === lowerSearchText ? (
                                    <span key={i} style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
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

            return searchedColumn === dataIndex ? highlightText(formattedText) : formattedText;
        },
    });

    const columns: TableColumnsType<DataType> = [
        {
            title: 'S.No',
            key: 'index',
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
            width: 50,
        },
        {
            title: 'Created Date',
            dataIndex: 'created_date',
            key: 'created_date',
            ...getColumnSearchProps('created_date', 'Date'),
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
            ...getColumnSearchProps('company', 'Company'),
        },
        {
            title: 'Branch',
            dataIndex: 'branch',
            key: 'branch',
            ...getColumnSearchProps('branch', 'Branch'),
        },
        {
            title: 'Category',
            dataIndex: 'domain',
            key: 'domain',
            ...getColumnSearchProps('domain', 'Category'),
        },
        {
            title: 'Category Type',
            dataIndex: 'document_type',
            key: 'document_type',
            ...getColumnSearchProps('document_type', 'Category Type'),
        },
        {
            title: 'Document Name',
            dataIndex: 'document_name',
            key: 'document_name',
            ...getColumnSearchProps('document_name', 'Document Name'),
        },
        {
            title: 'Created By',
            dataIndex: 'created_by',
            key: 'created_by',
            ...getColumnSearchProps('created_by', 'Created By'),
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            ...getColumnSearchProps('remarks', 'Remarks'),
        },
        {
            title: 'Uploaded Files',
            dataIndex: 'filesData',
            key: 'files',
            ...getColumnSearchProps('filesData', 'Uploaded Files', (value, record) =>
                record.filesData?.some(file => file.fileName.toLowerCase().includes(value.toLowerCase()))
            ),
            render: (filesData: FileData[]) => {
                if (!filesData || filesData.length === 0) {
                    return <span>No files available</span>;
                }
                const firstFile = filesData[0];
                const remainingFiles = filesData.slice(1);
                if (remainingFiles.length > 0) {
                    return (
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
                            title="--- Uploaded Files List ---"
                            trigger="hover"
                        >
                            <span>
                                {firstFile.fileName}... ({remainingFiles.length} more)
                            </span>
                        </Popover>
                    );
                }
                return <span>{firstFile.fileName}</span>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center' as 'center',
            width: '100px',
            render: (_, record) => {
                const filesData = record.filesData;
                const fileActionsContent = (
                    <div>
                        {filesData?.map((file) => {
                            const fileUrl = `${fileRootPath}${file.fileName}`;
                            const fileUrl1 = `${fileRootPath}`;
                            const fileExtension = fileUrl.split('.').pop()?.toLowerCase();

                            return (
                                <div key={file.fileid} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            flex: 1,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "150px"
                                        }}
                                        title={file.fileName}
                                    >
                                        {file.fileName.length > 20
                                            ? `${file.fileName.substring(0, 20)}...`
                                            : file.fileName}
                                    </p>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Tooltip title="View File" color='purple' placement='left'>
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
                                                    } else if (['jpg', 'jpeg', 'png', 'gif', 'pdf'].includes(fileExtension)) {
                                                        window.open(fileUrl, '_blank');
                                                    } else {
                                                        window.open(fileUrl, '_blank');
                                                    }
                                                }}
                                                style={{ marginRight: '10px', padding: '5px 10px', border: '1px solid black', backgroundColor: 'transparent' }}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Download File" color="purple">
                                            <Button
                                                icon={<DownloadOutlined />}
                                                style={{ border: '1px solid black', backgroundColor: 'transparent', }}
                                                onClick={() => handleDownload(fileUrl1, file.fileName)}
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
                                size='middle'
                                icon={<FolderOpenOutlined size={18} />}
                                style={{
                                    marginRight: '10px',
                                    borderColor: 'black'
                                }}
                            />
                        </Popover>
                        <Tooltip
                            title={<span style={{ color: 'white', fontSize: '12px' }}>Edit Document</span>}
                            color="purple">
                            <Button
                                size='middle'
                                onClick={() => handleEdit(record)}
                                icon={<FiEdit size={12} />}
                                style={{
                                    borderColor: 'black'
                                }}
                            />
                        </Tooltip>
                    </>
                );
            },
        },
    ];

    const handleEdit = async (record: DataType) => {
        await fetchDocuments();
        console.log(record);
        setCurrentDocument(record);
        setIsModalVisible(true);
        form2.setFieldsValue(record)
    };

    const handleDelete = async (documentId: number) => {
        try {
            await documentService.deleteDocument(documentId);
            message.success('Document deleted successfully');
            fetchDocuments();
        } catch (error) {
            message.error('Failed to delete document');
        }
    };

    const fileHandling = async (res) => {
        try {
            const fileList = res.filePath?.fileList;
            if (!Array.isArray(fileList) || fileList.length === 0) {
                message.error("No files selected.");
                return;
            }
            const formData = new FormData();
            formData.append('id', `${res.file_id_unq}`);
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append('file', file.originFileObj);
                } else {
                    console.warn("File object is missing");
                }
            });
            await documentService.updateFileUpload(formData);
            message.success("Files uploaded successfully");
            await fetchDocuments();
        } catch (error) {
            AlertMessages.getErrorMessage("File not uploaded");
            console.error("File upload error:", error);
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

    const handleModalClose = () => {
        setIsModalVisible(false)
        fetchDocuments();
    }

    const handleSubmit = async (values: any) => {
        if (currentDocument) {
            try {
                const updatedDocument = {
                    ...currentDocument,
                    ...values,
                    document_id: currentDocument.document_id,
                };
                await documentService.updateDocument(updatedDocument)
                fileHandling(updatedDocument);
                await fetchDocuments();
                message.success('Document updated successfully');
                setIsModalVisible(false);
                handleModalClose();
                navigate('/view-documents')
            } catch (error) {
                message.error('Failed to update document');
            }
        }
    };

    const getFilteredData = () => {
        let filteredData = data;

        if (selectedDomain && selectedDomain !== 'All') {
            filteredData = filteredData.filter(item => item.domain === selectedDomain);
        }

        if (selectedDocType && selectedDocType.length > 0) {
            filteredData = filteredData.filter(item => selectedDocType.includes(item.document_type));
        }

        return filteredData;
    };

    const handleResetFilteredData = () => {
        form1.resetFields();
        setselectedDomain('All');
        setselectedDocType(undefined);
        setData(data);
        setOpenFiltersModal(false);
    };

    function showFilterModal() {
        setOpenFiltersModal(true)
    }

    const onFinish = (values) => {
        getFilteredData();
        setOpenFiltersModal(false);
    };

    useEffect(() => {
        if (currentDocument) {
            form2.setFieldsValue(currentDocument);
        }
    }, [currentDocument, form2]);

    const handleOnModalClose = () => {
        setIsModalVisible(false);
        setFileList([])
    }

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

    const handleFileDelete = async (fileid: string) => {
        try {
            const res = await documentService.removeKRUploadDocument(fileid);
            setCurrentDocument(prevDoc => ({
                ...prevDoc,
                filesData: prevDoc.filesData.filter(file => file.fileid !== fileid)
            }));


        } catch (error) {
            console.error("Delete error:", error);
            message.error("Something went wrong while deleting the file.");
        }
    };

    const handleNavigate = () => {
        navigate('/add-document');
    };

    return (
        <>
            <PageContainer
                title="View Repository"
                extra={[
                    <>
                        <Button key="add" style={{ marginRight: 10, borderColor: '#1677ff', color: '#1677ff' }} onClick={handleNavigate}>
                            Add Document
                        </Button>
                    </>
                ]}
            >
                <div>
                    <Row align="middle" style={{ marginBottom: '20px', marginTop: '-10px' }}>

                        <Col style={{ marginLeft: '100px', marginTop: '40px' }}>
                            <Form.Item
                                label="Category"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontWeight: 'bold',
                                }}
                            >
                                <Select placeholder="Please Select Category"
                                    style={{
                                        width: 200,
                                        fontWeight: 'normal',
                                    }}
                                    allowClear
                                    showSearch
                                    value={selectedDomain}
                                    onChange={(value) => setselectedDomain(value || 'All')}
                                >
                                    {domains.map((domain) => (
                                        <Select.Option key={domain.domainId} value={domain.domainType}>
                                            {domain.domainType}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: '100px', marginTop: '40px' }}>
                            <Form.Item
                                label="Category Type"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontWeight: 'bold',
                                }}
                            >
                                <Select
                                    mode='multiple'
                                    placeholder="Select Category Type"
                                    onChange={(value) => setselectedDocType(value)}
                                    value={selectedDocType}
                                    style={{
                                        width: 200,
                                        fontWeight: 'normal',
                                    }}
                                    allowClear
                                    showSearch
                                    maxTagCount={1}
                                    maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
                                    dropdownStyle={{ maxHeight: 200, overflowY: 'auto' }}
                                >
                                    {Object.values(DocumentTypeEnum).map((type) => (
                                        <Select.Option key={type} value={type}>
                                            {type}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
                <Table
                    size='small'
                    columns={columns}
                    dataSource={Array.isArray(getFilteredData()) ? getFilteredData() : []}
                    rowKey="document_id"
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        onChange: (page, pageSize) => {
                            setPage(page);
                            setPageSize(pageSize);
                        },
                    }}
                    loading={loading}
                />

                <Modal
                    title="Edit Document"
                    open={isModalVisible}
                    destroyOnClose={false}
                    onCancel={handleModalClose}
                    footer={null}
                    afterOpenChange={(open) => {
                        if (open) {
                            handleEditModalOpen(selectedRecord);
                        }
                    }}
                >
                    <Form
                        form={form2}
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        <Form.Item
                            name="domain"
                            label="Category"
                            rules={[{ required: true, message: 'Please select a Category' }]}
                        >
                            <Select placeholder="Please Select Category">
                                {Object.values(DomainEnum).map((domain) => (
                                    <Select.Option key={domain} value={domain}>
                                        {domain}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="document_type"
                            label="Category Type"
                            rules={[{ required: true, message: 'Please select a Category type' }]}
                        >
                            <Select placeholder="Please Select Category Type">
                                {Object.values(DocumentTypeEnum).map((type) => (
                                    <Select.Option key={type} value={type}>
                                        {type}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="document_name"
                            label="Document Name"
                            rules={[{ required: true, message: 'Please Enter Document Name' }]}
                        >
                            <Input placeholder="Please Enter Document Name" />
                        </Form.Item>

                        <Form.Item
                            name="created_by"
                            label="Created By"
                            rules={[{ required: true, message: 'Please select Created By' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="remarks"
                            label="Remarks"
                            rules={[{ required: false, message: 'Please Enter Remarks' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>

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
                                                // Other File Types (PDF, Excel, Word, Zip, etc.) - Show Download Link
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
                        <Form.Item style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </PageContainer>

            <Drawer width={'20%'} open={openFilterModal} onClose={() => setOpenFiltersModal(false)} >
                <Form form={form1} layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={[16, 16]} >
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item
                                label="Category"
                                style={{
                                    fontWeight: 'bold',
                                    marginLeft: '20px'
                                }}
                            >
                                <Select
                                    placeholder="Select Category"
                                    onChange={(value) => setselectedDomain(value)}
                                    value={selectedDomain}
                                    style={{
                                        width: 200,
                                        fontWeight: 'normal',
                                    }}
                                >
                                    <Option value="All">All</Option>
                                    {Object.values(DomainEnum).map((domain) => (
                                        <Select.Option key={domain} value={domain}>
                                            {domain}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item
                                label="Category Type"
                                style={{
                                    fontWeight: 'bold',
                                    marginLeft: '20px'
                                }}
                            >
                                <Select
                                    mode='multiple'
                                    placeholder="Select Category Type"
                                    onChange={(value) => setselectedDocType(value)}
                                    value={selectedDocType}
                                    style={{
                                        width: 200,
                                        fontWeight: 'normal',
                                    }}
                                    maxTagCount={1}
                                    maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
                                    dropdownStyle={{ maxHeight: 200, overflowY: 'auto' }}
                                >
                                    {Object.values(DocumentTypeEnum).map((type) => (
                                        <Select.Option key={type} value={type}>
                                            {type}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Button type='primary' htmlType='submit' style={{ marginLeft: '160px' }}>Filter</Button>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default KnowledgeRepositoryView