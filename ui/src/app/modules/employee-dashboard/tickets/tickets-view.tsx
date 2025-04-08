import { CaretRightOutlined, UndoOutlined } from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { AlertMessages, BranchReq } from "@hrexpert/shared-models";
import { BranchesService, EmployeeOnboardingService, EmployeeTicketsService } from "@hrexpert/shared-services";
import { Button, Card, Col, Divider, Form, Modal, Row, Select, Table, Tag } from "antd";
import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useIAMClientState } from "../../../common/iam-client-react";

const TicketsView = () => {
    const [form] = Form.useForm();
    const [formModel] = Form.useForm();
    const Option = Select
    const [branches, setBranches] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([]);
    const [page, setPage] = React.useState(1);
    const branchService = new BranchesService()
    const employeeDetails = new EmployeeOnboardingService()
    const [openModal, setOpenModal] = useState<boolean>(false)
    const employeeTicketsService = new EmployeeTicketsService()
    const [ticketsData, setTicketsData] = useState<any[]>([])
    const [ticketDetails, setTicketDetails] = useState<any>()
    const { IAMClientAuthContext, dispatch } = useIAMClientState();


    useEffect(() => {
        getAllBranches();
        form.setFieldsValue({ branches: "ALL" })
        handleBranchChange(null)

    }, []);

    const getTickets = (value) => {
        try {
            const req = { employeeId: value.employeeId }
            employeeTicketsService.getAllTickets(req).then((res) => {
                if (res.status) {
                    setTicketsData(res.data)
                } else {
                    AlertMessages.getSuccessMessage(res.internalMessage)
                    console.log("Failed to post Data");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getAllBranches = () => {
        try {
            branchService.getAllBranches().then((res) => {
                if (res.status) {
                    setBranches(res.data);
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const handleBranchChange = (branchId: any) => {
        if (branchId === "ALL") {
            form.setFieldsValue({ branches: "ALL" })
        } else if (branchId === null) {
            form.setFieldsValue({ branches: "ALL" })
        } else if (branchId === '') {
            form.setFieldsValue({ branches: "ALL" })
        } else {
            form.setFieldsValue({ branches: branchId })
        }
        const branchRequest = new BranchReq(branchId);
        employeeDetails.getEmpDetailsByBranch(branchRequest).then((res) => {
            if (res.status) {
                setEmployees(res.data);
            } else {
                setEmployees('No Data Found');
            }
        });
    };

    const closeTicket = (value) => {
        try {
            employeeTicketsService.closeTicket(value).then((res) => {
                if (res.status) {
                    setTicketsData(res.data)
                    formModel.resetFields()
                    setOpenModal(false)
                    getTickets({})
                } else {
                    AlertMessages.getSuccessMessage(res.internalMessage)
                    console.log("Failed to post Data");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const dynamicColumns: ColumnsType<any> = [
        {
            title: 'Ticket ID',
            dataIndex: 'id',
            align: 'center',
            render: (text) => ('TD' + text),
        },
        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Employee Name',
            dataIndex: 'firstName',
            sorter: (a, b) => a.firstName.localeCompare(b.firstName),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Department',
            dataIndex: 'departmentName',
            sorter: (a, b) => a.departmentName.localeCompare(b.departmentName),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Designation',
            dataIndex: 'designationName',
            sorter: (a, b) => a.designationName.localeCompare(b.designationName),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Raised Date',
            dataIndex: 'raisedDate',
            sorter: (a, b) => a.appliedDate.localeCompare(b.appliedDate),
            sortDirections: ['ascend', 'descend'],
            render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : '-'),
        },
        {
            title: 'Closed Date',
            dataIndex: 'closedDate',
            sorter: (a, b) => a.closedDate.localeCompare(b.closedDate),
            sortDirections: ['ascend', 'descend'],
            render: (text, record) => (record.status === 'Closed' ? dayjs(text).format('YYYY-MM-DD') : '-'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (value) => {
                return <Tag color={value == 'Open' ? 'blue' : 'green'} style={{ borderRadius: 50 }}>{value}</Tag>
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                <>
                    <Button type='primary' onClick={() => { setOpenModal(true), setTicketDetails(ticketsData.find((rec) => rec.id === record?.id)) }}>View Details</Button>
                </>
            )
        },
    ];

    const reset = () => {
        setTicketsData([])
        form.resetFields()
    }

    return (
        <>
            <PageContainer title="Employee Raised Tickets" >
                <Form layout='vertical' form={form} onFinish={getTickets}>
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label="Branch" name="branches">
                                <Select showSearch
                                    allowClear
                                    placeholder="Select Branch"
                                    dropdownMatchSelectWidth={false}
                                    optionFilterProp="children"
                                    onChange={(value) => handleBranchChange(value)}>
                                    <Option value={'ALL'}> ALL </Option>
                                    {branches.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label='Employee Name' name='employeeId' >
                                <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                    optionFilterProp="children" placeholder="Select Employee Name"  >
                                    {employees?.map((rec: any) => (
                                        <Option value={rec.employeeId} key={rec.employeeId}>
                                            {rec.employeeCode} {rec.employeeName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: '23px' }}>
                            <Button color="primary" variant="outlined" htmlType="submit">
                                Submit
                            </Button>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                            <Button icon={<UndoOutlined />} onClick={reset} type='dashed' danger> Reset </Button>
                        </Col>
                    </Row>


                </Form>

                {ticketsData.length > 0 && (
                    <Table
                        columns={dynamicColumns}
                        dataSource={ticketsData}
                        pagination={{
                            onChange(current) {
                                setPage(current);
                            },
                            position: ['topRight'],
                        }}
                        scroll={{ x: true }}
                        rowKey="id"
                        bordered
                    />
                )}


                <Modal
                    width={'55rem'}
                    open={openModal}
                    onCancel={() => setOpenModal(false)}
                    footer={null}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <ProCard style={{ width: '50rem' }} bordered headerBordered title={<span>Ticket ID : {'TID' + ticketDetails?.id}</span>}
                            extra={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ marginRight: '14rem', flexGrow: 1, textAlign: 'center' }}>{'Created On : ' + dayjs(ticketDetails?.createdAt)}</span>
                                    <Tag color={ticketDetails?.status == 'Open' ? 'blue' : 'green'} style={{ borderRadius: 50 }}>{ticketDetails?.status}</Tag>
                                </div>
                            }>
                            <h3> <CaretRightOutlined /> Subject: {ticketDetails?.subject}</h3>
                            <span style={{ fontSize: '14px' }}>Category : {ticketDetails?.category}</span>
                        </ProCard>

                        <ProCard style={{ width: '50rem' }} bordered title={<>Employee <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '5px', color: '#888' }}> ({dayjs(ticketDetails?.createdAt).format('YYYY-MM-DD HH:MM')})</span></>}>
                            <span style={{ fontSize: '14px' }}>{ticketDetails?.issue}</span>
                        </ProCard>

                        {(ticketDetails?.status === 'Closed' ?
                            <>
                                <ProCard style={{ width: '50rem' }} bordered title={<>Support Team <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '5px', color: '#888' }}> ({dayjs(ticketDetails?.updatedAt).format('YYYY-MM-DD HH:MM')})</span></>}>
                                    <span style={{ fontSize: '14px' }}>{ticketDetails?.reply}</span>
                                </ProCard>
                            </> :
                            <ProCard>
                                This ticket is still in OPEN. Waiting for Your response
                            </ProCard>
                        )}

                        {(ticketDetails?.status === 'Open' ?
                            <Form layout='vertical' form={formModel} onFinish={closeTicket}>
                                <Form.Item hidden label="You" name='ticketId' initialValue={ticketDetails?.id}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="You" name='reply'>
                                    <TextArea rows={4} />
                                </Form.Item>
                                <Button type="primary" htmlType="submit">
                                    close Ticket
                                </Button>
                            </Form> : <></>)}

                    </div>
                </Modal>

            </PageContainer>
        </>
    )
}
export default TicketsView