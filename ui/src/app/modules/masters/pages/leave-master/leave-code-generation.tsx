import { useEffect, useRef, useState } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Card, Col, Form, Input, notification, Row, Select, Table, Typography } from "antd";
import { LeaveTypeService } from "@hrexpert/shared-services";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface LeaveCodeGridIProps {
    groupCode: any[];
    generatedId: number;
    handleCloseModal: () => void;
    isModalOpen: boolean;
    state: string
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const states = [
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'CT', label: 'Chhattisgarh' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JH', label: 'Jharkhand' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'ML', label: 'Meghalaya' },
    { value: 'MZ', label: 'Mizoram' },
    { value: 'NL', label: 'Nagaland' },
    { value: 'OD', label: 'Odisha' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'SK', label: 'Sikkim' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TG', label: 'Telangana' },
    { value: 'TR', label: 'Tripura' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'UK', label: 'Uttarakhand' },
    { value: 'WB', label: 'West Bengal' }
];

export default function LeaveCodeGeneration(props: LeaveCodeGridIProps) {
    const [form] = Form.useForm();
    const isPrefilled = useRef(false);
    const Option = Select;
    const navigate = useNavigate()
    const [leaveTypeData, setLeaveTypeData] = useState([]);
    const [leaveGroupCode, setLeaveGroupCode] = useState('');
    const [collapse, setCollapse] = useState(null);
    const service = new LeaveTypeService();

    useEffect(() => {
        getAllActiveLeaveType();
    }, []);

    useEffect(() => {
        if (!isPrefilled.current && props.groupCode?.length && leaveTypeData.length) {
            form.resetFields()
            prefillLeaveTypeData();
            isPrefilled.current = true; // ✅ Mark as prefilled to prevent re-running
        }
    }, [props.groupCode, leaveTypeData]);

    function getAllActiveLeaveType() {
        setLeaveTypeData([]);
        service.getAllActiveLeaveType()
            .then((res) => {
                if (res.status) {
                    setLeaveTypeData(res.data);
                } else {
                    setLeaveTypeData([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching leave types:", error);
            });
    }

    function prefillLeaveTypeData() {
        console.log(props.groupCode, '--group code data')
        const updatedData = leaveTypeData.map((leave) => {
            const matchedData = props.groupCode.find(g => g.leaveTypeId === leave.leaveTypeId);
            return matchedData ? { ...leave, ...matchedData } : leave;
        });
        console.log(updatedData, '---up datedata')
        setLeaveTypeData(updatedData);
        console.log(props.state, '----state')
        form.setFieldsValue({ state: props.state })
        // Set form fields based on updatedData
        form.setFieldsValue({
            leaveData: updatedData.map(item => ({
                countPerMonthYear: item.countPerMonthYear || '',
                calculation: item.calculation || '',
                specialInstructions: item.specialInstructions || '',
                accumQty: item.accumQty || '',
                accumPeriod: item.accumPeriod || '',
                collapse: item.collapse || '',
                encashLimit: item.encashLimit || '',
                collapseMonth: item.collapseMonth || '',
            }))
        });
    }

    // const handleInputChange = (index, field, value) => {
    //     const newData = [...leaveTypeData];
    //     newData[index] = { ...newData[index], [field]: value };
    //     setLeaveTypeData(newData);
    //     form.setFieldsValue({
    //         leaveData: newData
    //     });
    // };

    const handleInputChange = (index, field, value) => {
        setLeaveTypeData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index] = {
                ...updatedData[index],
                [field]: value || ""
            };
            return updatedData;
        });

        form.setFieldsValue({
            [`leaveData[${index}].${field}`]: value || ""
        });
    };


    // const handleCollapseChange = (index, value) => {
    //     const newData = [...leaveTypeData];
    //     newData[index] = { ...newData[index], collapse: value };

    //     // If collapse is "Monthly", set collapseMonth to "Monthly"
    //     if (value === "Monthly") {
    //         newData[index].collapseMonth = "Monthly";
    //     } else {
    //         newData[index].collapseMonth = ""; // Reset for other options
    //     }

    //     setLeaveTypeData(newData);
    //     form.setFieldsValue({ leaveData: newData });
    // };

    const handleCollapseChange = (index, value) => {
        setLeaveTypeData((prevData) => {
            return prevData.map((item, i) => i === index ? { ...item, collapse: value, collapseMonth: value === "Monthly" ? "Monthly" : "" } : item)
        });
        form.setFieldsValue({
            [`leaveData[${index}].collapse`]: value,
            [`leaveData[${index}].collapseMonth`]: value === "Monthly" ? "Monthly" : ""
        });
    };

    const handleSubmit = () => {
        const values = form.getFieldsValue();
        const generatedCode = leaveTypeData
            .map(record => `${record.leaveTypeCode}-${record.accumQty === undefined ? 0 : record.accumQty}`)
            .join('/');
        setLeaveGroupCode(generatedCode);

        const payload = {
            leaveGroupCode: generatedCode,
            leaveGroupId: props.generatedId,
            leaveTypeData: leaveTypeData,
            state: form.getFieldValue('state')
        };
        console.log(payload, '-------payload-------------')
        service.saveLeaveCodeDefine(payload).then((res) => {
            if (res.status) {
                notification.success({ message: "Leave Code Created Successfully", })
                form.resetFields();
                props.handleCloseModal()
                navigate('/leave-group-code-grid')
            } else {
                notification.error({ message: "Error while creating", });
            }
        });
    };

    const columns: any = [
        {
            title: "S.No",
            key: "sno",
            render: (_, __, index) => index + 1,
            align: "center"
        },
        {
            title: "Leave Type Name",
            dataIndex: "leaveTypeName",
            align: "center"
        },
        {
            title: "Leave Type Code",
            dataIndex: "leaveTypeCode",
            align: "center"
        },
        // {
        //     title: "Count per month/Year",
        //     dataIndex: "countPerMonthYear",
        //     render: (_, record, index) => (
        //         <Form.Item name={['leaveData', index, 'countPerMonthYear']}>
        //             <Input onChange={(e) => handleInputChange(index, 'countPerMonthYear', e.target.value)} />
        //         </Form.Item>
        //     ),
        //     align: "center"
        // },
        // {
        //     title: "Calculation",
        //     dataIndex: "calculation",
        //     render: (_, record, index) => (
        //         <Form.Item name={['leaveData', index, 'calculation']}>
        //             <Input onChange={(e) => handleInputChange(index, 'calculation', e.target.value)} />
        //         </Form.Item>
        //     ),
        //     align: "center"
        // },
        // {
        //     title: "Special Instructions",
        //     dataIndex: "specialInstructions",
        //     render: (_, record, index) => (
        //         <Form.Item name={['leaveData', index, 'specialInstructions']}>
        //             <Input onChange={(e) => handleInputChange(index, 'specialInstructions', e.target.value)} />
        //         </Form.Item>
        //     ),
        //     align: "center"
        // },
        {
            title: "Accum Qty",
            dataIndex: "accumQty",
            render: (_, record, index) => (
                <Form.Item name={['leaveData', index, 'accumQty']} initialValue={0}>
                    <Input onChange={(e) => handleInputChange(index, 'accumQty', e.target.value)} />
                </Form.Item>
            ),
            align: "center"
        },
        // New columns
        {
            title: "Accum Period",
            dataIndex: "accumPeriod",
            render: (_, record, index) => (
                <Form.Item name={['leaveData', index, 'accumPeriod']}>
                    <Select
                        onChange={(value) => handleInputChange(index, 'accumPeriod', value)}
                        showSearch allowClear optionFilterProp="children" placeholder="Select Accum Period">
                        <Option value="Yearly">Yearly</Option>
                        <Option value="Monthly">Monthly</Option>
                        <Option value="Daily">Daily</Option>
                    </Select>
                </Form.Item>
            ),
            align: "center"
        },
        {
            title: "Collapse",
            dataIndex: "collapse",
            render: (_, record, index) => (
                <Form.Item name={['leaveData', index, 'collapse']}>
                    <Select
                        onChange={(value) => handleCollapseChange(index, value)}
                        showSearch allowClear optionFilterProp="children" placeholder="Select Collapse">
                        <Option value="Monthly">Monthly</Option>
                        <Option value="Yearly">Yearly</Option>
                        <Option value="Quarterly">Quarterly</Option>
                    </Select>
                </Form.Item>
            ),
            align: "center"
        },
        {
            title: "Collapse Month",
            dataIndex: "collapseMonth",
            render: (_, record, index) => (
                <Form.Item name={['leaveData', index, 'collapseMonth']}>
                    {leaveTypeData[index]?.collapse === "Monthly" ? (
                        <Input value="Monthly" readOnly />
                    ) : (
                        <Select
                            onChange={(value) => handleInputChange(index, 'collapseMonth', value)}
                            showSearch allowClear placeholder="Select Month">
                            {months.map((month) => (
                                <Option key={month} value={month}>{month}</Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
            ),
            align: "center"
        },
        {
            title: "Encash Limit",
            dataIndex: "encashLimit",
            render: (_, record, index) => (
                <Form.Item name={['leaveData', index, 'encashLimit']} initialValue={0}>
                    <Input onChange={(e) => handleInputChange(index, 'encashLimit', e.target.value)} />
                </Form.Item>
            ),
            align: "center"
        },
        // {
        //     title: "Collapse Count",
        //     dataIndex: "collapseCount",
        //     render: (_, record, index) => (
        //         <Form.Item name={['leaveData', index, 'collapseCount']}>
        //             <Input onChange={(e) => handleInputChange(index, 'collapseCount', e.target.value)} />
        //         </Form.Item>
        //     ),
        //     align: "center"
        // },
        {
            title: "Carry Forward Limit",
            dataIndex: "carryForward",
            render: (_, record, index) => (
                <Form.Item name={['leaveData', index, 'carryForward']} initialValue={0}>
                    <Input onChange={(e) => handleInputChange(index, 'carryForward', e.target.value)} />
                </Form.Item>
            ),
            align: "center"
        },
    ];

    return (
        <PageContainer title='Leave Code Generation' breadcrumbRender={false}>
            <Form form={form} layout="vertical">
                <Row gutter={24} justify={'end'}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={8}>
                        <Form.Item label='State' name={'state'} initialValue="AP">
                            <Select showSearch allowClear optionFilterProp="children" placeholder='Select State'>
                                {states.map((state) => (
                                    <Option key={state.value} value={state.value}>
                                        {state.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col >
                        <Button style={{ marginTop: '25px' }} color="primary" variant="outlined" onClick={handleSubmit}>Submit</Button>
                    </Col>
                    <Col >
                        <Button icon={<UndoOutlined />} style={{ marginTop: '25px' }} type="dashed" danger onClick={() => form.resetFields()}>
                            Reset
                        </Button>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={leaveTypeData}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    rowKey="leaveTypeId"
                />
            </Form>
        </PageContainer>
    );
}
