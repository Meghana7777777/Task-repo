import React, { useEffect, useRef, useState } from 'react';
import { Table, Typography, message, Popconfirm, Form, Space, Button, Modal, Input } from 'antd';
import { AssetSharedService } from '@hrexpert/shared-services';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Excel } from 'antd-table-saveas-excel';
import Highlighter from 'react-highlight-words';
import { ColumnType } from 'antd/es/table';
import AddAsset from './add-asset';

const { Title } = Typography;

const ViewAsset = (props) => {
    const { scopes } = props
    const [assetData, setAssetData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [selectedStyleData, setSelectedStyleData] = useState<any>(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [selectedDomainsData, setSelectedDomainsData] = useState<any>(null);
    const assetService = new AssetSharedService();

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const response = await assetService.getAssets();
            if (response && response.status) {
                setAssetData(response.data);
            } else {
                message.error('Failed to fetch asset data');
            }
        } catch (error) {
            message.error('Error fetching asset data');
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

    const assets = [
        {
            title: "S.No",
            dataIndex: "serialNumber",
            render: (text, record, index) => (page - 1) * pageSize + (index + 1),
        },
        { title: 'Asset', dataIndex: 'asset' },
        { title: 'Asset Type', dataIndex: 'assetType' },
    ];

    const preprocessData = (data) => {
        return data.map((record, index) => {
            const updatedRecord = { key: index + 1 };
            assets.forEach((column) => {
                const value = record[column.dataIndex];
                updatedRecord[column.dataIndex] =
                    value === null || value === undefined ? "" : value;
            });
            return updatedRecord;
        });
    };

    const editAsset = (asset: any) => {
        setSelectedDomainsData(asset);
        setSelectedStyleData(asset);
        setIsUpdate(true);
        setModalVisible(true);
    };

    const updateAsset = (data: any) => {
        assetService.updateAsset(data.assetId, data).then((res) => {
            if (res.status) {
                message.success('Updated successfully');
                fetchAssets();
                setModalVisible(false);
            } else {
                message.error(res.internalMessage);
            }
        })
    }

    const exportExcel = () => {
        const excel = new Excel();
        const processedData = preprocessData(assetData);
        excel
            .addSheet('Asset')
            .addColumns(assets)
            .addDataSource(processedData, { str2num: false })
            .saveAs('Asset.xlsx');
    };

    const handleDeactivate = async (assetId: any) => {
        try {
            const response = await assetService.deactivateAsset(assetId);
            if (response && response.status) {
                message.success('Asset deactivated successfully');
                fetchAssets();
            } else {
                message.error('Failed to deactivate Asset');
            }
        } catch (error) {
            message.error('Error deactivating Asset');
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
            key: 'sno',
            render: (text, record, index) => (page - 1) * pageSize + (index + 1),
        },
        {
            title: 'Asset',
            dataIndex: 'asset',
            ...getColumnSearchProps('asset')

        },
        {
            title: 'Asset Type',
            dataIndex: 'assetType',
            ...getColumnSearchProps('assetType')

        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Popconfirm
                        title="Are you sure you want to deactivate this asset type?"
                        onConfirm={() => handleDeactivate(record.assetId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined style={{ color: 'red', cursor: 'pointer', fontSize: '16px' }} />
                    </Popconfirm>
                    <EditOutlined
                        style={{ color: "#1890ff", fontSize: "13px", cursor: 'pointer' }}
                        onClick={() => editAsset(record)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <PageContainer
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
                    dataSource={assetData}
                    columns={columns}
                    rowKey="assetId"
                    pagination={{ pageSize: 10 }}
                />
            </PageContainer>
            <Modal
                title={isUpdate ? "Update Asset" : "Create Asset"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width={window.innerWidth > 768 ? "60%" : "100%"}
            >
                <AddAsset
                    key={isUpdate ? selectedStyleData?.assetId : 'New Asset'}
                    updateDetails={updateAsset}
                    isUpdate={isUpdate}
                    closeForm={closeModal}
                    assetData={selectedStyleData || {}}
                    getAllAssets={fetchAssets}
                />
            </Modal>
        </>
    );
};

export default ViewAsset;
