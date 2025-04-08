import React, { useState, useEffect, useRef } from 'react';
import { Button, Calendar, Modal, Row, Col, Table, Tag, Switch, message, Popconfirm, List, Divider, Badge, Checkbox, Space, Input, Form, Select } from 'antd';
import { EditOutlined, CheckCircleOutlined, CloseCircleOutlined, FilterOutlined, RightSquareOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { AlertMessages, HolidayDto, ScopesEnum } from "@hrexpert/shared-models";
import { BranchesService, HolidayCalanderService } from '@hrexpert/shared-services';
import HolidayForm from '../holiday-form/holiday-form';
import dayjs from 'dayjs';
import { ColumnsType, ColumnType } from 'antd/es/table';
import { PageContainer } from '@ant-design/pro-layout';
import Highlighter from 'react-highlight-words';
import { SequenceUtils } from "../../../../../app/common/utils";
import { useIAMClientState } from '../../../../common/iam-client-react';
import { Excel } from 'antd-table-saveas-excel';



interface HolidayViewIProps {
    scopes: ScopesEnum[]
}

const holidayService = new HolidayCalanderService();

const HolidayView = (props: HolidayViewIProps) => {
    const { scopes } = props
    const { Option } = Select
    const [form] = Form.useForm();
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);
    const [holidays, setHolidays] = useState<any>([]);
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
    const [selectedDateHolidays, setSelectedDateHolidays] = useState<any>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStyleData, setSelectedStyleData] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState<number>(1);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [refresh, setRefresh] = useState<number>(1)
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const [branchesData, setBranchesData] = useState([]);
    const branchService = new BranchesService()
    const [branchId, setBranchId] = useState<any | null>(null);
    const [pageSize, setPageSize] = useState<number>(1);
    const role = IAMClientAuthContext.user.roles;
    // const Branch = IAMClientAuthContext.user.unitId

    useEffect(() => {
        getAllBranches();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchName: "ALL" })
            getAllHolidays();
        } else {
            form.setFieldsValue({ branchName: IAMClientAuthContext.user.unitId })
            getAllHolidays();
        }
    }, [branchId]);

    const getAllBranches = () => {
        branchService.getAllBranches().then((res) => {

            if (res.status) {
                setBranchesData([{ id: 'All', branchName: 'All' }, ...res.data]);
            } else {
                setBranchesData([]);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
            setBranchesData([]);
        });
    }

    const getAllHolidays = async () => {
        try {
            const formValues = form.getFieldsValue();
            const req = { 
                branchId: IAMClientAuthContext.user.roles === "SuperAdmin" 
                    ? (formValues.branchName === "ALL" ? null : formValues.branchName) 
                    : IAMClientAuthContext.user.unitId 
            };
            
            
            const res = await holidayService.getActiveHolidays(req);
            console.log(req)
            if (res.status) {
                setHolidays(res.data);
                //AlertMessages.getSuccessMessage(res.internalMessage)
            } else {
                message.error("Failed to get data");
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const openFormForNewHoliday = () => {
        setSelectedHoliday(null);
        setIsUpdate(false);
        setShowForm(true);
        setRefresh(prev => prev + 1);
    };



    const closeForm = () => {
        setShowForm(false);
        setSelectedHoliday(null);
        setIsUpdate(false);
    };

   
    const updateHolidayDetails = (holidayData: HolidayDto) => {
        holidayService.updateHoliday(holidayData)
            .then((res) => {
                if (res.status) {
                    message.success("Holiday Calendar updated successfully");
                    getAllHolidays();
                    closeForm();
                    setRefresh(prev => prev + 1);
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating Holiday Calendar details:", error);
            });
    };

    const toggleHolidayStatus = async (holiday: HolidayDto) => {
        const payload = { id: holiday.id, isActive: !holiday.isActive };
        try {
            const response = await holidayService.activateOrDeactivateHoliday(payload);
            if (response.status) {
                message.success(`Holiday ${payload.isActive ? 'activated' : 'deactivated'} successfully`);
                getAllHolidays();
            } else {
                message.error(response.internalMessage);
            }
        } catch (error) {
            console.error("Failed to toggle holiday status:", error);
        }
    };

    const dateCellRender = (value: dayjs.Dayjs) => {
        if (!holidays) return null;
        const dateHolidays = holidays.filter(holiday =>
            dayjs(holiday.holidayDate).isSame(value, 'day') && holiday.isActive
        );
        return (
            <div>
                {dateHolidays.map(holiday => (
                    <Badge
                        key={holiday.id}
                        count={holiday.holidayName}
                        style={{ backgroundColor: '#52c41a', color: '#fff', boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)' }}
                    />
                ))}
            </div>
        );
    };

    useEffect(() => {
        if (selectedHoliday) {
            form.setFieldsValue({
                holidayName: selectedHoliday.holidayName,
                holidayDate: selectedHoliday.holidayDate,
                branchName: selectedHoliday.branchName,
                type: selectedHoliday.type,
            });
        }
    }, [selectedHoliday, form]);

    const editBranch = (rowData: any) => {
        rowData.holidayDate = dayjs(rowData.holidayDate, 'YYYY-MM-DD')
        setSelectedStyleData(rowData);
        setIsUpdate(true);
        setShowForm(true);
        setRefresh(prev => prev + 1);
        setSelectedHoliday(rowData);
    };

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
    const handleUnit = (value: number | string) => {
        form.setFieldsValue({ branchId: value });
        getAllHolidays(); // Fetch data based on the selected unit
    };

    let i = 1;
    const holiday = [
        { title: "Branch", dataIndex: "branchName" },
        { title: 'Type', dataIndex: 'type' },
        { title: 'Holiday', dataIndex: 'holidayName' },
        { title: 'Date', dataIndex: 'holidayDate' },
    ];

    const preprocessData = (data) => {
        return data.map((record, index) => {
            const updatedRecord = { key: index + 1 };
            holiday.forEach((column) => {
                const value = record[column.dataIndex];
                updatedRecord[column.dataIndex] =
                    value === null || value === undefined ? "" : value;
            });
            return updatedRecord;
        });
    };

    const exportExcel = () => {
        const excel = new Excel();
        const processedData = preprocessData(holidays);
        excel
            .addSheet('holiday')
            .addColumns(holiday)
            .addDataSource(processedData, { str2num: false })
            .saveAs('Holiday.xlsx');
    };

    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
        },
        {
            title: "Branch",
            dataIndex: "branchName",
            key: "branchName",
            ...getColumnSearchProps("branchName"),
            render: (_, record) => {
                return <><Form.Item name={record.employeeId + 'branchName'} initialValue={record.branchName}><span>{record.branchName}</span></Form.Item><Form.Item name={record.employeeId + 'employeeId'} hidden></Form.Item></>
            }
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            ...getColumnSearchProps("type")
        },
        {
            title: "Holiday",
            dataIndex: "holidayName",
            key: "holidayName",
            ...getColumnSearchProps("holidayName")
        },
        {
            title: "Date",
            dataIndex: "holidayDate",
            key: "holidayDate",
            render: (holidayDate) => dayjs(holidayDate).format('YYYY-MM-DD'),
        },
        {
            title: "Status",
            dataIndex: "isActive",
            align: "center",
            ...getColumnSearchProps("isActive"),
            render: (isActive, rowData) => (
                <>
                    {isActive ? (
                        <Tag icon={<CheckCircleOutlined />} color="#87d068">
                            Active
                        </Tag>
                    ) : (
                        <Tag icon={<CloseCircleOutlined />} color="#f50">
                            Inactive
                        </Tag>
                    )}
                </>
            ),
            filterIcon: (filtered: boolean) => (
                <FilterOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
            ),
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }: any) => (
                <div
                    className="custom-filter-dropdown"
                    style={{ flexDirection: "row", marginLeft: 10 }}
                >
                    <Checkbox
                        checked={selectedKeys.includes('Active')}
                        onChange={() =>
                            setSelectedKeys(
                                selectedKeys.includes('Active') ? [] : ['Active']
                            )
                        }
                    >
                        <span style={{ color: "green" }}>Active</span>
                    </Checkbox>
                    <Checkbox
                        checked={selectedKeys.includes('Inactive')}
                        onChange={() =>
                            setSelectedKeys(
                                selectedKeys.includes('Inactive') ? [] : ['Inactive']
                            )
                        }
                    >
                        <span style={{ color: "red" }}>Inactive</span>
                    </Checkbox>
                    <div className="custom-filter-dropdown-btns">
                        <Button
                            onClick={() => {
                                handleReset(clearFilters);
                                confirm();
                            }}
                            className="custom-reset-button"
                        >
                            Reset
                        </Button>
                        <Button
                            type="primary"
                            style={{ margin: 10 }}
                            onClick={() => confirm()}
                            className="custom-ok-button"
                        >
                            OK
                        </Button>
                    </div>
                </div>
            ),
            onFilter: (value, record) => {
                if (typeof value === 'string') {
                    const status = record.isActive ? 'Active' : 'Inactive';
                    return value === status;
                }
                return false;
            },
        },
        {
            title: "Action",
            hidden: IAMClientAuthContext.user.roles === 'SuperAdmin' ? false : true,
            dataIndex: "action",
            align: "center",
            render: (text, rowData) => (
                <span >
                    {rowData.isActive ? (
                        <EditOutlined
                            className={"editSamplTypeIcon"}
                            type="edit"
                            onClick={() => {
                                if (rowData.isActive) {
                                    editBranch(rowData);
                                }
                            }}
                            style={{ color: "#1890ff", fontSize: "14px", display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }}
                        />
                    ) : (
                        ""
                    )}
                    <Divider type="vertical" />
                    <Popconfirm
                        onConfirm={(e) => {
                            toggleHolidayStatus(rowData);
                        }}
                        title={
                            rowData.isActive
                                ? "Are you sure to Deactivate Branches Mapping?"
                                : "Are you sure to Activate Branch Mapping?"
                        }
                    >
                        <Switch
                            size="default"
                            className={
                                rowData.isActive ? "toggle-activated" : "toggle-deactivated"
                            }
                            checkedChildren={<RightSquareOutlined type="check" />}
                            unCheckedChildren={<RightSquareOutlined type="close" />}
                            checked={rowData.isActive}
                        />
                    </Popconfirm>


                </span>
            ),
        },

    ];

    const onDateSelect = (date: dayjs.Dayjs) => {
        const dateHolidays = holidays.filter(holiday => dayjs(holiday.holidayDate).isSame(date, 'day'));
        setSelectedDate(date);
        setSelectedDateHolidays(dateHolidays);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedDate(null);
        setSelectedDateHolidays([]);
    };

    return (
        <PageContainer title='Holiday Calendar' breadcrumbRender={false}

            extra={
                <>
                    <Button type="primary" disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)} icon={<PlusOutlined />} onClick={openFormForNewHoliday}>
                        Add
                    </Button>
                    <Button style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>
                        Get Excel
                    </Button>
                </>
            }>
            <Form layout="vertical" form={form} >
                {IAMClientAuthContext.user.roles === 'SuperAdmin' && (<Row>
                    <Col span={8}>
                        <Form.Item
                            name="branchName"
                            label=" Filter By Branch Name"
                            initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : IAMClientAuthContext.user.unitId}
                        >
                            <Select
                                defaultValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : IAMClientAuthContext.user.unitId}
                                allowClear
                                showSearch
                                disabled={role === 'SuperAdmin' ? false : true}
                                optionFilterProp='children'
                                placeholder="Select Branch"
                                // onChange={handleBranchChange} // Trigger branch selection change
                                onChange={handleUnit}
                            >
                                {branchesData.map(branch => (
                                    <Option key={branch.id} value={branch.id}>
                                        {branch.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>)}</Form>
            <Row gutter={24}>
                <Col xs={24} sm={16} md={18} lg={18} xl={12} style={{ padding: '16px' }}>
                    <Calendar
                        style={{ transform: 'scale(1.0)', transformOrigin: 'top left', width: '100%' }}
                        cellRender={dateCellRender}
                        onSelect={onDateSelect}
                    />
                </Col>
                <Col xs={24} sm={8} md={6} lg={6} xl={12} style={{ padding: '16px', borderLeft: '1px solid #e8e8e8' }}>

                    <Table
                        columns={columns}
                        dataSource={holidays}
                        rowKey="id"
                        pagination={{
                            pageSize: 20,
                            onChange(current, pageSize) {
                                setPage(current);
                                setPageSize(pageSize);
                            },
                        }}
                    />
                </Col>
                <Modal
                    title={isUpdate ? "Update Holiday" : "Add Holiday"}
                    open={showForm}
                    footer={null}
                    onCancel={closeForm}
                    width="60%"
                    key={holidays[0]?.id}
                >
                    <HolidayForm
                        key={refresh}
                        updateDetails={updateHolidayDetails}
                        isUpdate={isUpdate}
                        holidayData={selectedStyleData}
                        closeForm={closeForm}
                        getAllHolidays={getAllHolidays}
                        form={form}
                    />
                </Modal>
                <Modal
                    open={isModalVisible}
                    title={`Holiday on ${selectedDate ? selectedDate.format('YYYY-MM-DD') : ''}`}
                    footer={null}
                    onCancel={closeModal}
                    width="60%"
                    key={holidays.id}
                >
                    {selectedDateHolidays?.length > 0 ? (
                        <List
                            dataSource={selectedDateHolidays}
                            renderItem={holiday => (
                                <List.Item>
                                    {holidays.holidayName}
                                </List.Item>
                            )}
                        />
                    ) : (
                        <p>No holidays on this date.</p>
                    )}
                </Modal>
            </Row>
        </PageContainer>
    );
};

export default HolidayView;