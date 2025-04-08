import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Table, Badge, Button, message, Form, Select, Col, Row, Popconfirm, Input, Space, Tag, Checkbox, Switch, Modal, Divider, Tooltip } from 'antd';
import { TeamCalenderService } from '@hrexpert/shared-services';
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { EmpDataReq, TeamCalenderDto } from '@hrexpert/shared-models';
import moment from 'moment';
import { ColumnType } from 'antd/lib/table';
import Highlighter from 'react-highlight-words';
import TeamCalenderForm from '../team-calender-form/team-calender-form';
import { PageContainer } from '@ant-design/pro-layout';

const { Title } = Typography;

const TeamCalenderView = () => {
    const [form] = Form.useForm();
    const [calenderData, setCalenderData] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const teamCalenderService = new TeamCalenderService();
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [selectedTeamCalender, setSelectedTeamCalender] = useState<any>(undefined);
    const [isUpdate, setIsUpdate] = useState(false)
    const searchInput = useRef(null);
    useEffect(() => {
        getAllTeamCalenderData();
    }, []);

    const getAllTeamCalenderData = () => {
        teamCalenderService.getAllTeamCalender().then(res => {
            if (res.status) {
                setCalenderData(res.data);
            } else {
                if (res.errorCode) {
                    setCalenderData([]);
                    message.error(res.internalMessage);
                } else {
                    message.error(res.internalMessage);
                }
            }
        }).catch(err => {
            setCalenderData([]);
            message.error(err.message);
        })
    }

    const openFormWithData = (viewData: TeamCalenderDto) => {
        console.log(viewData, 'viewData');
        setModalVisible(true);
        setIsUpdate(true)
        viewData.fromDate = moment(viewData.fromDate, 'YYYY-MM-DD').isValid() ? moment(viewData.fromDate).format('YYYY-MM-DD') : '';
        viewData.toDate = moment(viewData.toDate, 'YYYY-MM-DD').isValid() ? moment(viewData.toDate).format('YYYY-MM-DD') : '';
        setSelectedTeamCalender(viewData);
    };
    const openForm = () => {
        // Clear selected data when opening the form for adding a new branch
        setSelectedTeamCalender(null);
        setModalVisible(true);
    };
    const closeModal = () => {
        setModalVisible(false);
        setIsUpdate(false);
    };

    const deleteTeamCalender = (teamCalenderData: TeamCalenderDto) => {
        teamCalenderData.isActive = teamCalenderData.isActive ? false : true;
        teamCalenderService.activateOrDeactivateTeamCalender(teamCalenderData).then(res => {
            console.log(res);
            if (res.status) {
                getAllTeamCalenderData();
                message.success('Success');
            } else {
                if (res.errorCode) {
                    message.error(res.internalMessage);
                } else {
                    message.error(res.internalMessage);
                }
            }
        }).catch(err => {
            message.error(err.message);
        })
    }
    const updateTeamCalenderDetails = (data: TeamCalenderDto) => {
        console.log(data, 'data');
        teamCalenderService.updateTeamCalender(data)
            .then((res) => {
                if (res.status) {
                    message.success("TeamCalender updated successfully");
                    setModalVisible(false);
                    getAllTeamCalenderData();
                    setIsUpdate(false);
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating branch details:", error);
            });
    };

    const getBadgeColor = (available, total) => {
        const percentage = (available / total) * 100;
        if (percentage > 50) return 'success';
        if (percentage > 25) return 'warning';
        return 'error';
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

    const columns: any = [
        {
            title: 'Shift Code',
            dataIndex: 'shiftCode',
            key: 'name',
            render: (text, record) => ({
                children: <div>{text}</div>,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
            width: '20%',
        },
        {
            title: 'From Date',
            dataIndex: 'fromDate',
            key: 'fromDate',
            render: (value, record) => {
                return <span>
                    {record.fromDate ? moment(record.fromDate).format('YYYY-MM-DD') : '-'}
                </span>
            },
        },
        {
            title: 'ToDate',
            dataIndex: 'toDate',
            key: 'toDate',
            render: (value, record) => {
                return <span>
                    {record.toDate ? moment(record.toDate).format('YYYY-MM-DD') : '-'}
                </span>
            },
        },
        {
            title: 'Shift',
            dataIndex: 'shift',
            key: 'shift',
        }, {
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
            title: 'Action',
            align: "center",
            render: (text, rowData) => (
                <span>
                    <Tooltip placement="top" title='Edit'>
                        <EditOutlined className={'editSamplTypeIcon'} type="edit"
                            onClick={() => {
                                if (rowData.isActive) {
                                    openFormWithData(rowData);
                                } else {
                                    message.error('You Cannot Edit Deactivated Team Calender');
                                }
                            }}
                            style={{ color: '#1890ff', fontSize: '14px' }}
                        />
                    </Tooltip>
                    <Divider type="vertical" />
                    <Popconfirm onConfirm={e => { deleteTeamCalender(rowData); }}
                        title={
                            rowData.isActive
                                ? 'Are you sure to Deactivate Team Calender ?'
                                : 'Are you sure to Activate Team Calender ?'
                        }
                    >
                        <Switch size="default"
                            className={rowData.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                            checkedChildren={<RightSquareOutlined type="check" />}
                            unCheckedChildren={<RightSquareOutlined type="close" />}
                            checked={rowData.isActive}
                        />

                    </Popconfirm>
                </span>
            ),
        }

    ];

    return (
        <>
           <PageContainer title='Group Calender' breadcrumbRender={false}
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={openForm}>
                        Add
                    </Button>
                }
            >

                <Table
                    columns={columns}
                    dataSource={calenderData}
                    pagination={false}
                    rowKey={(record) => record.key}
                    bordered
                    
                />
                <Modal
                    title={isUpdate ? "Update Team Calender" : "Create Calender"}
                    open={modalVisible}
                    onCancel={closeModal}
                    footer={null}
                    width="60%"
                    key={calenderData.id}
                >
                    <TeamCalenderForm
                        key={Date.now()}
                        updateDetails={updateTeamCalenderDetails}
                        isUpdate={isUpdate}
                        teamCalenderData={selectedTeamCalender}
                        closeForm={closeModal}
                        getAllTeamCal={getAllTeamCalenderData}
                    />

                </Modal>
            </PageContainer>
        </>

    );
};

export default TeamCalenderView;
