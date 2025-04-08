import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, EyeOutlined, FilterOutlined, RightSquareOutlined } from "@ant-design/icons";
import { LeaveTypeService } from "@hrexpert/shared-services";
import { Button, Card, Checkbox, Divider, message, Modal, notification, Popconfirm, Switch, Table, Tag, Tooltip } from "antd";
import { title } from "process";
import { useEffect, useState } from "react";
import LeaveCodeGeneration from "./leave-code-generation";
import { render } from "@react-pdf/renderer";
import moment from "moment";
import { PageContainer } from "@ant-design/pro-layout";
import { SequenceUtils } from "ui/src/app/common/utils";
import { ScopesEnum } from "@hrexpert/shared-models";

interface LeaveCodeViewProps {
    groupCode: any[];
    scopes: ScopesEnum
}

export default function LeaveGroupCodeView(props: LeaveCodeViewProps) {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const service = new LeaveTypeService()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCodeDefineData, setSelectedCodeDefineData] = useState([])
    const [generatedId, setGeneratedId] = useState(0)
    const [state, setState] = useState('')
    useEffect(() => {
        getAllGeneratedCode()
    }, [selectedCodeDefineData])

    // useEffect(() => {
    //     if (selectedCodeDefineData.length > 0) {
    //         console.log(selectedCodeDefineData.length, '---us effect')
    //         setIsModalVisible(true);
    //     }
    // }, [selectedCodeDefineData.length > 0]);

    // const handleOpenModal = (groupCode) => {
    //     setState(groupCode.state)
    //     setGeneratedId(groupCode.id)
    //     setSelectedCodeDefineData([]);
    //     codeDefineDataByLeaveGroupCode(groupCode.id)
    // };

    const handleCloseModal = () => {
        setSelectedCodeDefineData([])
        setIsModalVisible(false);
        // getAllGeneratedCode()
    };

    function codeDefineDataByLeaveGroupCode(val) {
        const req = {
            leaveGroupCodeId: val
        }
        service.codeDefineDataByLeaveGroupCode(req).then((res) => {
            if (res.status) {
                setSelectedCodeDefineData(res.data)
            } else {
                notification.info({ message: 'No data against the generated code' })
                setSelectedCodeDefineData([])
            }
        })
    }

    function getAllGeneratedCode() {
        service.getAllGeneratedCode().then((res) => {
            if (res.status) {
                setData(res.data)
            } else {
                setData([])
            }
        })
    }

    function handleReset(clearFilters: any) {
        clearFilters();
        setSearchText("");
    }

    const modalColumns = [
        {
            title: "Leave Type Name",
            dataIndex: "leaveTypeName",
            key: "leaveTypeName",
            render: (text) => text.trim(), // To remove any extra newlines or spaces
        },
        {
            title: "Leave Type Name",
            dataIndex: "leaveTypeCode",
            key: "leaveTypeCode",
            render: (text) => text.trim(), // To remove any extra newlines or spaces
        },
        {
            title: "Accum Qty",
            dataIndex: "accumQty",
            key: "accumQty",
            render: (value) => (value !== null ? value : "-"),
        },
        {
            title: "Accum Period",
            dataIndex: "accumPeriod",
            key: "accumPeriod",
            render: (value) => (value !== null ? value : "-"),
        },
        {
            title: "Collapse",
            dataIndex: "collapse",
            key: "collapse",
            render: (value) => (value !== null ? value : "-"),
        },
        {
            title: "Collapse Month",
            dataIndex: "collapseMonth",
            key: "collapseMonth",
            render: (value) => (value !== null ? value : "-"),
        },
        {
            title: "Encash Limit",
            dataIndex: "encashLimit",
            key: "encashLimit",
            render: (value) => (value !== null ? value : "0"),
        },
        {
            title: "Carry Forward Limit",
            dataIndex: "carryForward",
            key: "carryForward",
            render: (value) => (value !== null ? value : "0"),
        },
    ];



    const columns: any = [
        {
            title: "S.No",
            key: "sno",
            render: (_, __, index) => index + 1,
            align: "center"
        },
        {
            title: 'Leave Group Code',
            dataIndex: 'generatedCode',
            render: (val, rec) => {
                return val ? `${rec.state + '/' + rec.generatedCode}` : '-'
            }
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            render: (val, rec) => {
                return moment(val).format('YYYY-MM-DD')
            }
        },
        {
            title: "Status",
            dataIndex: "isActive",
            align: "center",
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
            dataIndex: "action",
            align: "center",
            render: (text, rowData) => (
                <span>
                    <Tooltip title="Detail View">
                        <Button style={{ width: "50px", borderColor: "black" }}
                            onClick={() => { codeDefineDataByLeaveGroupCode(rowData.id), setIsModalVisible(true) }}
                        >
                            View
                        </Button>
                    </Tooltip>
                    {/* <Divider type="vertical" />
                    <Popconfirm
                        onConfirm={(e) => {
                            deleteLeave(rowData);
                        }}
                        title={
                            rowData.isActive
                                ? "Are you sure to Deactivate Leave Group Code ?"
                                : "Are you sure to Activate Leave Group Code ?"
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
                    </Popconfirm> */}
                </span>
            ),
        },
    ]
    return (
        <PageContainer title="Leave Group Code">
            <Table columns={columns} dataSource={data} />
            {/* <Modal
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                {selectedCodeDefineData.length > 0 ? (
                    <LeaveCodeGeneration groupCode={selectedCodeDefineData} generatedId={generatedId} handleCloseModal={handleCloseModal} isModalOpen={isModalVisible} state={state} />
                ) : (
                    <p>Loading...</p>
                )}
            </Modal> */}
            <Modal
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={900}
            >
                <Table columns={modalColumns} dataSource={selectedCodeDefineData} rowKey="leaveCodeDefineId" pagination={false}/>
            </Modal>
        </PageContainer>
    );
}