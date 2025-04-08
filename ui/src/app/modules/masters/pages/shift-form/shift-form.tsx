import { ExportOutlined, PlusOutlined, UndoOutlined, } from "@ant-design/icons";
import { PageContainer } from '@ant-design/pro-layout';
import { BranchesService, ShiftService } from "@hrexpert/shared-services";
import { ShiftDto } from "@hrexpert/shared-models";
import { Button, Card, Col, ColorPicker, Form, Input, Row, Select, Space, TimePicker, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';


export interface Props {
    shiftData: any;
    updateDetails: (Style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    shiftForm?: FormInstance<any>;
    getAllShifts: () => void
}
const ShiftForm = (props: Props) => {

    const [form] = Form.useForm();
    const service = new ShiftService();
    const { Option } = Select;
    const [disable, setDisable] = useState<boolean>(false)
    let navigate = useNavigate();
    const [brData, setBrData] = useState<any[]>([]);
    const brService = new BranchesService()

    // useEffect(() => {
    //     getAllBranches();
    //     // Initialize form values based on whether this is an update or a new entry
    //     if (props.shiftData && props.isUpdate) {
    //         form.setFieldsValue({
    //             ...props.shiftData,
    //             startTime: props.shiftData.startTime ? dayjs(props.shiftData.startTime, "h:mm A") : null,
    //             endTime: props.shiftData.endTime ? dayjs(props.shiftData.endTime, "h:mm A") : null,
    //         });
    //     } else {
    //         form.resetFields(); // Resets form for new entry
    //     }
    // }, [props.shiftData, props.isUpdate, form]);
    useEffect(() => {
        // Fetch branches only once when the component mounts
        getAllBranches();
    
        // Initialize form values based on props
        if (props.isUpdate && props.shiftData) {
            form.setFieldsValue({
                ...props.shiftData,
                branchName: props.shiftData.branchId,
                shiftType: props.shiftData.shiftType,
                startTime: props.shiftData.startTime ? dayjs(props.shiftData.startTime, "h:mm A") : null,
                endTime: props.shiftData.endTime ? dayjs(props.shiftData.endTime, "h:mm A") : null,
            });
            console.log(props.shiftData.branchId, '-------props.shiftData.branchName--------')
        } else {
            form.resetFields(); // Reset form for new entry
        }
    }, [
        props.shiftData && JSON.stringify(props.shiftData), // Compare by value instead of reference
        props.isUpdate,
    ]);
    


    const onReset = () => {
        form.setFieldsValue({
            ...props.shiftData,
            branchName: props.shiftData.branchId,
            shiftType: props.shiftData.shiftType,
            startTime: props.shiftData.startTime ? dayjs(props.shiftData.startTime, "h:mm A") : null,
            endTime: props.shiftData.endTime ? dayjs(props.shiftData.endTime, "h:mm A") : null,
        });
    };


    const createBranch = async (val: ShiftDto) => {
        try {
            service.createShift(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    props.closeForm()
                    props.getAllShifts()
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
            props.updateDetails({ ...formattedValues, id: props.shiftData?.id });
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
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.shiftData} >
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
                                    <Option key={br.id} value={br.id}>
                                        {br.branchName}
                                    </Option>
                                ))} 
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="shiftType"
                            label="Shift Type"
                            rules={[
                                { required: true, message: "Please Enter Shift Type" },

                            ]}
                        >
                            <Input placeholder="Enter Shift Type" />
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
export default ShiftForm

