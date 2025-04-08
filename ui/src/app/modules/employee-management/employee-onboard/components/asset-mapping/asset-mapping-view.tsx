import React, { useEffect, useRef, useState } from "react";
import {
    Table, Typography, Form, Space, Button, Row, Col,
    Select, Checkbox, Modal, DatePicker, Input, message
} from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import { EmpAssetMappingSharedService, AssetSharedService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import dayjs from "dayjs";
import { DeleteOutlined, EditFilled, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { EmpAsssetMappingModel } from "@hrexpert/shared-models";
import { Excel } from "antd-table-saveas-excel";
import Highlighter from "react-highlight-words";
import { ColumnsType, ColumnType } from "antd/es/table";

const { Option } = Select;
const { TextArea } = Input;
interface AssetMappingRow {
    key: string;
    employeeId: string;
    employeeName: string;
    issuedDate: string;
    returnDate: string;
    remarks: string;
    branch: string;
    assetStatus: string;
    isActive: string;
    [assetId: string]: string | boolean;
}

const ViewAssetMapping = () => {
    const [employeeList, setEmployeeList] = useState<any[]>([]);
    const [assetList, setAssetList] = useState<any[]>([]);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [newEmployeeId, setNewEmployeeId] = useState<number | null>(null);
    const [newAssetIds, setNewAssetIds] = useState<string[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [assetMappingData, setAssetMappingData] = useState<any>({});
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editEmployee, setEditEmployee] = useState<any>(null);
    const [editAssets, setEditAssets] = useState<string[]>([]);
    const [returnDate, setReturnDate] = useState(null);
    const [remarks, setRemarks] = useState("");
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [mappingData, setMappingData] = useState<any[]>([]);


    const employeeService = new EmployeeOnboardingService();
    const assetService = new AssetSharedService();
    const assetMappingService = new EmpAssetMappingSharedService();

    useEffect(() => {
        getAllData();
    }, []);

    const selectedEmployee = employeeList.find(emp => emp.employeeId === newEmployeeId);
    const selectedBranchName = selectedEmployee?.branchName || "";

    const getAllData = async () => {
        try {
            const [empRes, assetRes, mappingRes] = await Promise.all([
                employeeService.getActiveEmployeeList(),
                assetService.getAssets(),
                assetMappingService.getAllEmpAssets()
            ]);
            if (empRes.status) setEmployeeList(empRes.data);
            if (assetRes.status) setAssetList(assetRes.data);
            const grouped = mappingRes.data.reduce((acc: any, item: any) => {
                const empId = item.employeeId;
                const assetIds = item.assetIds || [];

                acc[empId] = assetIds.map((id: any) => id.toString());
                return acc;
            }, {});
            setAssetMappingData(grouped);
            setMappingData(mappingRes.data);
        } catch (err) {
            message.error("Error fetching data");
        }
    };

    const handleEmployeeSelect = (values: string[]) => {
        setSelectedEmployees(values);
    };

    const handleEditClick = (employeeId: number) => {
        const employee = employeeList.find(emp => emp.employeeId === employeeId);
        setEditEmployee(employee);
        const currentAssets = assetMappingData[employeeId] || [];
        setEditAssets(currentAssets.map((id: any) => id.toString()));
        setEditModalVisible(true);
        setReturnDate(null);
        setRemarks('');
    };

    const handleCreateMapping = async () => {
        if (!newEmployeeId || newAssetIds.length === 0) {
            message.error("Please select an employee and at least one asset.");
            return;
        }
        try {
            const existingMappings = await assetMappingService.getAllEmpAssets();
            const alreadyMapped = existingMappings.data?.some(
                (mapping: any) => mapping.employeeId === newEmployeeId
            );
            if (alreadyMapped) {
                message.warning("This employee already has an asset mapping.");
                return;
            }
            const payload: EmpAsssetMappingModel = {
                employeeAssetId: 0,
                employeeId: newEmployeeId,
                assetId: newAssetIds,
                issuedDate: new Date(),
                branch: selectedBranchName,
                returnDate: null,
                remarks: '',
                assetStatus: 'Assigned',
                isActive: true
            };
            console.log("Payload for creating mapping:", payload);
            const res = await assetMappingService.createEmpAssetMapping(payload);
            if (res.status) {
                message.success("Mapping created successfully");
                getAllData();
                setCreateModalVisible(false);
                setNewEmployeeId(null);
                setNewAssetIds([]);
            } else {
                message.error("Error creating mapping");
            }
        } catch (error) {
            console.error("Error creating mapping:", error);
            message.error("Error creating mapping");
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

    const dynamicAssetColumns: ColumnsType<AssetMappingRow> = assetList.map((asset) => ({
        title: asset.asset,
        dataIndex: asset.assetId.toString(),
        key: asset.assetId.toString(),
        render: (value: boolean) => (value ? "Yes" : "No"),
        width: 120,
    }));


    const columns: ColumnsType<AssetMappingRow> = [
        {
            title: "Employee Name",
            dataIndex: "employeeName",
            key: "employeeName",
            ...getColumnSearchProps("employeeName"),
            fixed: "left",
            width: 250,
        },
        {
            title: "Branch Name",
            dataIndex: "branch",
            key: "branch",
            ...getColumnSearchProps("branch"),
            // fixed: "left",
            width: 250,
        },
        ...dynamicAssetColumns,
        {
            title: "Issued Date",
            dataIndex: "issuedDate",
            key: "issuedDate",
            width: 150,
        },
        {
            title: "Return Date",
            dataIndex: "returnDate",
            key: "returnDate",
            width: 150,
        },
        {
            title: "Remarks",
            dataIndex: "remarks",
            key: "remarks",
            width: 250,
        },
        {
            title: "Asset Status",
            dataIndex: "assetStatus",
            key: "assetStatus",
            width: 150,
        },
        {
            title: "Actions",
            key: "actions",
            fixed: "right",
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button onClick={() => handleEditClick(+record.employeeId)}>
                        <EditOutlined />
                    </Button>
                    <Button
                        danger
                        onClick={() => handleDeleteMapping(+record.employeeId)}
                        style={{ color: "red", cursor: "pointer" }}
                    >
                        <DeleteOutlined />
                    </Button>

                </Space>
            ),
        },
    ];

    const exportExcel = () => {
        const rawData = selectedEmployees.map((empId) => {
            const employee = employeeList.find(emp => emp.employeeId === empId);
            const assets = assetMappingData[empId] || [];

            return {
                employeeName: employee?.employeeName || "",
                assignedAssets: assets.map((id) => {
                    const asset = assetList.find((a) => a.assetId.toString() === id);
                    return asset?.asset || id;
                }).join(", "),
                issuedDate: dayjs().format("YYYY-MM-DD"),
                returnDate: "",
                remarks: "",
                assetStatus: "Assigned",
                isActive: true
            };
        });

        const excelColumns = [
            { title: "S.No", dataIndex: "serialNumber" },
            { title: "Employee Name", dataIndex: "employeeName" },
            { title: "Assigned Assets", dataIndex: "assignedAssets" },
            { title: "Issued Date", dataIndex: "issuedDate" },
            { title: "Return Date", dataIndex: "returnDate" },
            { title: "Remarks", dataIndex: "remarks" },
            { title: "Asset Status", dataIndex: "assetStatus" },
            { title: "Is Active", dataIndex: "isActive" },
        ];

        const processedData = rawData.map((record, index) => ({
            serialNumber: index + 1,
            ...record,
            isActive: record.isActive ? "Yes" : "No"
        }));

        const excel = new Excel();
        excel
            .addSheet("Asset Mapping")
            .addColumns(excelColumns)
            .addDataSource(processedData, { str2num: false })
            .saveAs("Asset Mapping.xlsx");
    };

    const handleSaveEdit = async () => {
        if (!editEmployee || editAssets.length === 0) {
            message.error("Please select at least one asset.");
            return;
        }

        const payload = {
            employeeAssetId: 0,
            employeeId: editEmployee.employeeId,
            assetId: editAssets,
            issuedDate: new Date(),
            returnDate: returnDate ? new Date(returnDate) : null,
            remarks,
            assetStatus: 'Assigned',
            isActive: true
        };
        try {
            const res = await assetMappingService.updateEmpAssetMapping(payload);
            if (res.status) {
                message.success("Mapping updated successfully");
                getAllData();
                setEditModalVisible(false);
            } else {
                message.error("Error updating mapping");
            }
        } catch (error) {
            console.error("Update failed:", error);
            message.error("Update failed");
        }
    };

    const handleDeleteMapping = async (employeeId: number) => {
        const res = await assetMappingService.removeEmpAssetMapping(employeeId);
        if (res.status) {
            message.success("Mapping deleted");
            getAllData();
        } else {
            message.error("Need To Add Assets to Employee for deleting mapping");
        }
    };

    const filteredData = mappingData
        .filter((m) => {
            const employee = employeeList.find(e => e.employeeId === m.employeeId);

            const employeeMatch = selectedEmployees.length === 0 || selectedEmployees.includes(m.employeeId);
            const branchMatch = !selectedBranch || employee?.branchName === selectedBranch;

            return employeeMatch && branchMatch;
        })
        .map((mapping) => {
            const employee = employeeList.find((e) => e.employeeId === mapping.employeeId);
            const assignedAssetIds = mapping?.assetIds?.map((id) => id.toString()) || [];

            const assetStatusColumns = assetList.reduce((acc, asset) => {
                acc[asset.assetId.toString()] = assignedAssetIds.includes(asset.assetId.toString());
                return acc;
            }, {} as Record<string, boolean>);

            return {
                key: mapping.employeeId,
                employeeId: mapping.employeeId,
                employeeName: employee?.employeeName || "",
                issuedDate: mapping.issuedDate ? dayjs(mapping.issuedDate).format("YYYY-MM-DD") : "",
                returnDate: mapping.returnDate ? dayjs(mapping.returnDate).format("YYYY-MM-DD") : "",
                remarks: mapping.remarks || "",
                branch: employee?.branchName || "",
                assetStatus: mapping.assetStatus || "",
                isActive: mapping.isActive ? "Yes" : "No",
                ...assetStatusColumns,
            };
        });


    const uniqueBranchNames = Array.from(
        new Set(employeeList.map(emp => emp.branchName))
    ).map(branchName => ({
        label: branchName,
        value: branchName
    }));


    return (
        <PageContainer
            breadcrumbRender={false}
            extra={<Space>
                <Button onClick={() => setCreateModalVisible(true)} style={{ marginRight: 10, borderColor: '#1677ff', color: '#1677ff' }}>
                    Create
                </Button>
                <Button onClick={exportExcel}
                    style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed"
                >
                    Get Excel
                </Button>
            </Space>}
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Select Employee">
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select employee"
                                style={{ width: "100%" }}
                                onChange={(value) => setSelectedEmployees(value ? [value] : [])}
                                options={employeeList.map(emp => ({
                                    label: emp.employeeName,
                                    value: emp.employeeId,
                                }))}
                                value={selectedEmployees[0] || null}
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>

                    </Col>
                    <Col span={8}>
                        <Form.Item label="Select Branch">
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select branch"
                                style={{ width: "100%" }}
                                onChange={(branch) => {
                                    setSelectedBranch(branch);
                                }}
                                options={uniqueBranchNames}
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    bordered
                />
            </Form>

            <Modal
                title="Create Employee Asset Mapping"
                open={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onOk={handleCreateMapping}
                okText="Create"
                width={800}
            >
                <Form layout="vertical">
                    <Form.Item label="Employee"
                        style={{ width: '50%', marginTop: '20px' }}>
                        <Select
                            showSearch
                            allowClear
                            value={newEmployeeId ?? undefined}
                            placeholder="Select employees"
                            style={{ width: "100%" }}
                            onChange={(value) => setNewEmployeeId(value)}
                            options={employeeList.map(emp => ({
                                label: emp.employeeName,
                                value: emp.employeeId,
                            }))}
                            filterOption={(input, option) =>
                                (option?.label as string).toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {employeeList.map((emp) => (
                                <Option key={emp.employeeId} value={emp.employeeId}>
                                    {emp.employeeName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Branch" style={{ width: '50%', marginTop: '20px' }} >
                        <Input value={selectedBranchName} disabled />
                    </Form.Item>


                    <Form.Item label="Assets">
                        <div style={{ display: "grid", gap: "10px" }}>
                            {assetList.map((asset) => (
                                <Checkbox
                                    key={asset.assetId}
                                    checked={newAssetIds.includes(asset.assetId)}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setNewAssetIds((prev) =>
                                            checked ? [...prev, asset.assetId] : prev.filter((id) => id !== asset.assetId)
                                        );
                                    }}
                                >
                                    {asset.asset}
                                </Checkbox>
                            ))}
                        </div>
                    </Form.Item>

                    <Form.Item label="Issued Date" style={{ width: '50%' }}>
                        <Input value={dayjs().format("YYYY-MM-DD")} readOnly />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Asset Mapping"
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onOk={handleSaveEdit}
                okText="Save"
                width={600}
            >
                {editEmployee && (
                    <Form layout="vertical">
                        <Form.Item label="Employee">
                            <Input value={editEmployee.employeeName} disabled />
                        </Form.Item>
                        <Form.Item label="Assets">
                            {assetList.map((asset) => (
                                <Checkbox
                                    key={asset.assetId}
                                    checked={editAssets.includes(asset.assetId.toString())}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        const assetIdStr = asset.assetId.toString();
                                        setEditAssets((prev) =>
                                            isChecked ? [...prev, assetIdStr] : prev.filter((id) => id !== assetIdStr)
                                        );
                                    }}
                                >
                                    {asset.asset}
                                </Checkbox>
                            ))}
                        </Form.Item>
                        <Form.Item label="Return Date">
                            <DatePicker style={{ width: "100%" }} onChange={setReturnDate} />
                        </Form.Item>

                        <Form.Item label="Remarks">
                            <TextArea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </PageContainer>
    );
};

export default ViewAssetMapping;
