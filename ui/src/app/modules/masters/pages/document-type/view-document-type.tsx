import React, { useEffect, useRef, useState } from 'react';
import { Table, Card, Typography, Spin, message, Popconfirm, Form, Space, Button, Modal, Input } from 'antd';
import { DocumentTypeSharedService, DomainSharedService, ExpensesTypeService } from '@hrexpert/shared-services';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Excel } from 'antd-table-saveas-excel';
import Highlighter from 'react-highlight-words';
import { ColumnType } from 'antd/es/table';
import AddDocumentType from './add-document-type';

const { Title } = Typography;

const ViewDocumentType = (props) => {
    const { scopes } = props
    const [domainsData, setDomainsData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [selectedStyleData, setSelectedStyleData] = useState<any>(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [selectedDomainsData, setSelectedDomainsData] = useState<any>(null);
    const documentTypeSharedService = new DocumentTypeSharedService();

    useEffect(() => {
        fetchDocumentType();
    }, []);

    const fetchDocumentType = async () => {
        setLoading(true);
        try {
            const response = await documentTypeSharedService.getDocumentType();
            if (response && response.status) {
                const activeDomain = response.data.filter((document: any) => document.isActive);
                setDomainsData(activeDomain || []);
            } else {
                message.error('Failed to fetch document data');
            }
        } catch (error) {
            message.error('Error fetching document data');
        } finally {
            setLoading(false);
        }
    };

    const openForm = () => {
        setSelectedStyleData(null);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setIsUpdate(false);
    };

    const documentType = [
        { title: "Document Id", dataIndex: "documentTypeId" },
        { title: 'Domain', dataIndex: 'doamin' },
        { title: 'Document Type', dataIndex: 'documentType' }
    ];

    const preprocessData = (data) => {
        return data.map((record, index) => {
            const updatedRecord = { key: index + 1 };
            documentType.forEach((column) => {
                const value = record[column.dataIndex];
                updatedRecord[column.dataIndex] =
                    value === null || value === undefined ? "" : value;
            });
            return updatedRecord;
        });
    };

    const editDomainsType = (expense: any) => {
        setSelectedDomainsData(expense);
        setSelectedStyleData(expense);
        setIsUpdate(true);
        setModalVisible(true);
    };

    const updateDomainType = (data: any) => {
        documentTypeSharedService.updateDocumentType(data.documentTypeId, data).then((res) => {
            if (res.status) {
                message.success('Updated successfully');
                fetchDocumentType();
                setModalVisible(false);
            } else {
                message.error(res.internalMessage);
            }
        })
    }

    const exportExcel = () => {
        const excel = new Excel();
        const processedData = preprocessData(domainsData);
        excel
            .addSheet('expensesType')
            .addColumns(documentType)
            .addDataSource(processedData, { str2num: false })
            .saveAs('expensesType.xlsx');
    };

    const handleDeactivate = async (documentTypeId: any) => {
        try {
            const response = await documentTypeSharedService.deactivateDocumentType(documentTypeId);
            if (response && response.status) {
                message.success('Document type deactivated successfully');
                fetchDocumentType();
            } else {
                message.error('Failed to deactivate document type');
            }
        } catch (error) {
            message.error('Error deactivating document type');
        }
    };

    function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    }

    function handleReset(clearFilters: any) {
        clearFilters();
        setSearchText("");
    }

    const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
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

    const columns = [
        {
            title: 'S.No',
            dataIndex: 'documentTypeId',
            ...getColumnSearchProps('documentTypeId')
        },
        {
            title: 'Domain Type',
            dataIndex: 'domain',
            ...getColumnSearchProps('domain')

        },
        {
            title: 'Document Type',
            dataIndex: 'documentType',
            ...getColumnSearchProps('documentType')

        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Popconfirm
                        title="Are you sure you want to deactivate this document type?"
                        onConfirm={() => handleDeactivate(record.domainId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined style={{ color: 'red', cursor: 'pointer', fontSize: '16px' }} />
                    </Popconfirm>
                    <EditOutlined
                        style={{ color: "#1890ff", fontSize: "13px", cursor: 'pointer' }}
                        onClick={() => editDomainsType(record)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <PageContainer
                title="Document Type"
                breadcrumbRender={false}
                extra={
                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openForm}
                        >
                            Add
                        </Button>
                        <Button style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>
                            Get Excel
                        </Button>

                    </Space>
                }
            >
                <Table
                    dataSource={domainsData}
                    columns={columns}
                    rowKey="domainId"
                    pagination={{ pageSize: 10 }}
                />
            </PageContainer>
            <Modal
                title={isUpdate ? "Update Document Type" : "Create Document Type"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width={window.innerWidth > 768 ? "60%" : "100%"}
            >
                <AddDocumentType
                    key={isUpdate ? selectedStyleData?.expenseId : 'new Expenses Data'}
                    updateDetails={updateDomainType}
                    isUpdate={isUpdate}
                    closeForm={closeModal}
                    documentTypeData={selectedStyleData || {}}
                    getAllDocumentType={fetchDocumentType}
                />
            </Modal>
        </>
    );
};

export default ViewDocumentType;
