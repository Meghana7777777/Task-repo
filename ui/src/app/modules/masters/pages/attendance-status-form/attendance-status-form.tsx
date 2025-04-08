import { ExportOutlined, PlusOutlined, UndoOutlined, } from "@ant-design/icons";
import { PageContainer } from '@ant-design/pro-layout';
import { BranchesService, AttendanceStatusService } from "@hrexpert/shared-services";
import { AttendanceStatusDto } from "@hrexpert/shared-models";
import { Button, Card, Col, ColorPicker, Form, Input, Row, Select, Space, TimePicker, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';


export interface Props {
    attendanceStatusData: any;
    updateDetails: (Style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    attendanceStatusForm?: FormInstance<any>;
    getAllAttendanceStatus: () => void
}
const AttendanceStatusForm = (props: Props) => {

    const [form] = Form.useForm();
    const service = new AttendanceStatusService();
    const { Option } = Select;
    const [disable, setDisable] = useState<boolean>(false)
    let navigate = useNavigate();
    const [brData, setBrData] = useState<any[]>([]);
    const brService = new BranchesService()

    
    useEffect(() => {
        // Fetch branches only once when the component mounts
        getAllBranches();
    
        // Initialize form values based on props
        if (props.isUpdate && props.attendanceStatusData) {
            form.setFieldsValue({
                ...props.attendanceStatusData,
                branchName: props.attendanceStatusData.branchId,
                attendanceStatus: props.attendanceStatusData.attendanceStatus,
                startTime: props.attendanceStatusData.startTime ? dayjs(props.attendanceStatusData.startTime, "h:mm A") : null,
                endTime: props.attendanceStatusData.endTime ? dayjs(props.attendanceStatusData.endTime, "h:mm A") : null,
            });
            console.log(props.attendanceStatusData.branchId, '-------props.attendanceStatusData.branchName--------')
        } else {
            form.resetFields(); // Reset form for new entry
        }
    }, [
        props.attendanceStatusData && JSON.stringify(props.attendanceStatusData), // Compare by value instead of reference
        props.isUpdate,
    ]);
    


    const onReset = () => {
        form.setFieldsValue({
            ...props.attendanceStatusData,
            branchName: props.attendanceStatusData.branchId,
            attendanceStatus: props.attendanceStatusData.attendanceStatus,
            startTime: props.attendanceStatusData.startTime ? dayjs(props.attendanceStatusData.startTime, "h:mm A") : null,
            endTime: props.attendanceStatusData.endTime ? dayjs(props.attendanceStatusData.endTime, "h:mm A") : null,
        });
    };


    const createBranch = async (val: AttendanceStatusDto) => {
        try {
            service.createAttendanceStatus(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    props.closeForm()
                    props.getAllAttendanceStatus()
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.error(error);
        } finally {
            setDisable(false);
        }
    };

    const saveData = (val: any) => {
        // Format the start and end time to 24-hour format before passing to the backend
        const formattedValues = {
            ...val,
            startTime: dayjs(val.startTime).format("HH:mm"),
            endTime: dayjs(val.endTime).format("HH:mm"),
        };

        if (props.isUpdate) {
            props.updateDetails({ ...formattedValues, id: props.attendanceStatusData?.id });
        } else {
            createBranch(formattedValues);
        }
    };

    const getAllBranches = async () => {
        console.log("Fetching active branches...");
        try {
            const res = await brService.getActiveBranches();
            if (res.status) {
                console.log("Branches fetched successfully:", res.data);
                setBrData(res.data);
            } else {
                console.error("Failed to fetch branches:", res.internalMessage);
            }
        } catch (err) {
            console.error("Error fetching branches:", err);
        }
    };    

    return (
        <Card
        >
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.attendanceStatusData} >
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden     >
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>

                        <Form.Item
                            name="branchName"
                            label="Branch"
                            rules={[{ required: true, message: "Please select a branch" }]}
                        >
                            <Select placeholder="Select Branch" showSearch allowClear
                            filterOption>
                                {brData.map((br) => (
                                    <Option key={br.id} value={br.branchName}>
                                        {br.branchName}
                                    </Option>
                                ))} 
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="attendanceStatus"
                            label="Status Type"
                            rules={[
                                { required: true, message: "Please Enter Status Type" },

                            ]}
                        >
                            <Input placeholder="Enter Status Type" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            label="Start Time"
                            name="startTime"
                            rules={[
                                { required: true, message: "Please select a start time" },
                            ]}
                        >
                            <TimePicker
                                placeholder="Select Start Time"
                                format="HH:mm"  // 24-hour format
                                allowClear
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            label="End Time"
                            name="endTime"
                            rules={[
                                { required: true, message: "Please select an end time" },
                            ]}
                        >
                            <TimePicker
                                placeholder="Select End Time"
                                format="HH:mm"  // 24-hour format
                                allowClear
                            />
                        </Form.Item>
                    </Col>


                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ant-submit-btn"
                                style={{ marginLeft: 20, marginTop: 23 }}
                                disabled={disable}
                            >
                                {props.isUpdate ? "Update" : "Submit"}
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="default"
                                danger
                                icon={<UndoOutlined />}
                                onClick={onReset}
                                style={{ marginLeft: 20, marginTop: 23 }}
                                disabled={disable}
                            >
                                Reset
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
}
export default AttendanceStatusForm

