import { PageContainer } from '@ant-design/pro-layout';
import { EmpDataReq, LateMinMomentRecordsReq, ScopesEnum } from '@hrexpert/shared-models';
import { ApplForLeavesSharedService, AttendanceServices, BranchesService, LeaveAllocationService } from '@hrexpert/shared-services';
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, message, Popover, Row, Select, Table, TableColumnsType } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from 'react';
import { useIAMClientState } from "../../../common/iam-client-react";
import './attendance-info.css';

interface LateMinMomentsRecordsProps {
    scopes: ScopesEnum[],
    employeeCode: string,
    date: string,
    getAllAttendance: () => void;

}
interface DataType {
    records: any;
    key?: React.Key;
    type?: string;
    title?: string;
    fixed?: string;
    width?: number;
    dataIndex?: any
    align?: any
    render?: any
    filterDropdown?: any
    filterIcon?: any
    onFilter?: any
}
dayjs.extend(duration);

const LateMinRecords = (props: LateMinMomentsRecordsProps) => {
    const [page, setPage] = useState(1);
    const [employeeData, setEmployeeData] = useState([])
    const attendanceService = new AttendanceServices()
    const service = new ApplForLeavesSharedService()
    const branchesService = new BranchesService();
    const [branches, setBranches] = useState<any>([]);
    const leaveAllocationService = new LeaveAllocationService();
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [form] = Form.useForm()
    const Option = Select
    const [employees, setEmployees] = useState<any>([]);
    const [remark, setRemark] = useState("");
 

    useEffect(() => {
        getLateMinMomentRecordsData()
    }, [props.employeeCode, props.date])
    

    const getLateMinMomentRecordsData = () => {
        const req = new LateMinMomentRecordsReq()
        req.employeeCode = props.employeeCode
        req.month = dayjs(props.date).format("YYYY-MM-DD")

        attendanceService.getLateMinMomentRecordsData(req).then((res) => {
            if (res.status) {
                setEmployeeData(res.data);
            } else {
                message.error(res.internalMessage);
                setEmployeeData([])
            }
        })
    }

    const onChangeChecked = (lateMinId, remark) => {
        attendanceService.approveLateMin({ id: lateMinId, remarks: remark }).then((res) => {
            if (res.status) {
                console.log("Approved")
                getLateMinMomentRecordsData()
                props.getAllAttendance()
                setRemark("")
            }
        }).catch((err) => {
            console.log(err, "errr")
        })
    };
    const onChangeUnchecked = (lateMinId) => {
        attendanceService.rejectLateMin({ id: lateMinId }).then((res) => {
            if (res.status) {
                console.log("Rejected")
                getLateMinMomentRecordsData()
                props.getAllAttendance()
            }
        }).catch((err) => {
            console.log(err, "errr")
        })
    };

    const lateMinRecordsColumns: ColumnsType<any> = [
        {
            title: 'S No',
            key: 'sno',
            align: "center",
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: "Date",
            align: "center",
            dataIndex: "date",
        },
        {
            title: "Swipe Out Time",
            align: "center",
            dataIndex: "swipeOutTime",
            render: (text) => text ? text : "-"
        },
        {
            title: "Swipe In Time",
            align: "center",
            dataIndex: "swipeInTime",
            render: (text) => text ? text : "-"
        },
        {
            title: "Late Minutes",
            align: "center",
            dataIndex: "actualLateMin",
        },
        {
            title: "Final Late Minutes",
            align: "center",
            dataIndex: "finalLateMin",
        },
        {
            title: "Moments",
            align: "center",
            dataIndex: "swipesEnum",
            render: (text) => text === "REMAINING" ? "MIDDLE IN/OUT" : text
            
        },
        {
            title: "Remarks",
            align: "center",
            dataIndex: "remarks",
        },
        {
            title: "Actions",
            align: "center",
            dataIndex: "status",
            render: (text, rec) => {
                if (text === "OPEN") {
                    return (
                        <Popover
                            content={(
                                <Form>
                                    <Form.Item label="Remarks">
                                        <Input 
                                            value={remark} 
                                            onChange={(e) => setRemark(e.target.value)} 
                                            placeholder="Enter remarks" 
                                        />
                                    </Form.Item>
                                    <Button type="primary" onClick={() => onChangeChecked(rec.lateMinId, remark)}>
                                        Confirm
                                    </Button>
                                </Form>
                            )}
                            title="Add Remarks"
                            trigger="click"
                        >
                            <Checkbox checked={false}></Checkbox>
                        </Popover>
                    );
                } else if (text === "APPROVED") {
                    return (
                        <Checkbox checked onChange={() => onChangeUnchecked(rec.lateMinId)} />
                    );
                }
                return null;
            }
        }
        
    ]

    const onReset = () => {
        form.resetFields()
        setEmployeeData([])
    }



    return (
        <>
            <PageContainer title='Late Minutes Records' breadcrumbRender={false}>
                <Table
                    className="small-table"
                    size="small"
                    columns={lateMinRecordsColumns}
                    dataSource={employeeData}
                    bordered
                    rowKey="empCode"
                    pagination={false}
                />
            </PageContainer>

        </>
    );
}
export default LateMinRecords