import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Table, Badge, Button, message, Form, Select, Col, Row, Input, Space, } from 'antd';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { PlusOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { EmpDataReq, EmployeeShiftReq, EmployeeShiftUpdateReq, ShiftGroupEnum } from '@hrexpert/shared-models';
import { ColumnsType, ColumnType } from 'antd/es/table';
import Highlighter from 'react-highlight-words';
import { PageContainer } from '@ant-design/pro-layout';
const EmployeeShiftMapping = () => {
    const [form] = Form.useForm();
    const [empData, setEmpData] = useState<any>([]);
    const [departments, setDepartments] = useState<any>([]);
    const [division, setDivision] = useState<any>([]);
    const [branch, setBranch] = useState<any>([]);
    const empService = new EmployeeOnboardingService;
    const [searchedColumn, setSearchedColumn] = useState<string>("");
    const [searchText, setSearchText] = useState<string>("");
    const [isTableDisabled, setIsTableDisabled] = useState(false);
    const { Option } = Select
    const searchInput = useRef(null);
    const [selectedRowKeysData, setSelectedRowKeysData] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    useEffect(() => {
        getDepartmentsInEmpDetails();
        getBranchesInEmpDetails();
        getDivisionsInEmpDetails();
    }, [])

    const getAllEmployeeData = () => {
        try {
            const req = new EmployeeShiftReq
            req.branch = form.getFieldValue('branch')
            req.division = form.getFieldValue('division')
            req.department = form.getFieldValue('department')
            req.shiftGroup = form.getFieldValue('shiftGroup')
            empService.getAllEmployeesForShiftMap(req).then((res) => {
                console.log(req)
                if (res.status) {
                    setEmpData(res.data)
                    setIsTableDisabled(true)
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (error) {
            console.log(error)
        }

    }

    const getDepartmentsInEmpDetails = () => {
        try {
            empService.getDepartmentsInEmpDetails().then((res) => {
                if (res.status) {
                    setDepartments(res.data)
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (error) {
            console.log(error)
        }

    }
    const getBranchesInEmpDetails = () => {
        try {
            empService.getBranchesInEmpDetails().then((res) => {
                if (res.status) {
                    setBranch(res.data)
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (error) {
            console.log(error)
        }

    }

    const getDivisionsInEmpDetails = () => {
        try {
            empService.getDivisionsInEmpDetails().then((res) => {
                if (res.status) {
                    setDivision(res.data)
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (error) {
            console.log(error)
        }

    }
    function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    }

    function handleReset(clearFilters: any) {
        clearFilters();
        setSearchText("");
    }
    const onReset = () => {
        form.resetFields();
        setSearchText('');
        setEmpData([]);
        setIsTableDisabled(false)
    }
    const onReset1 = () => {
        setSelectedRowKeysData([]);
        setSelectedRows([]);
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
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeysData(selectedRowKeys);
            setSelectedRows(selectedRows);
            setIsTableDisabled(true);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
        selectedRowKeys: selectedRowKeysData
    };
    const updateLogs = () => {
        const request = new EmployeeShiftUpdateReq();
        request.shiftGroup = form.getFieldValue('newShiftGroup');
        request.employeeIds = selectedRowKeysData;
        empService.updateEmpLogsByShiftCode(request).then(res => {
            console.log(request)
            if (res.status) {
                message.success('Shift updated Successfully');
                getAllEmployeeData();
                setIsTableDisabled(false)
                // searchData();
            } else {
                if (res.errorCode) {
                    message.success(res.internalMessage);
                } else {
                    message.error(res.internalMessage);
                }
            }
        }).catch(err => {
            message.error(err.message);
        })
    }



    const columns: ColumnsType<any> = [

        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            key: 'employeeCode',
            ...getColumnSearchProps("employeeCode"),
        },
        {
            title: 'Employee Name',
            dataIndex: 'firstName',
            key: 'firstName',
            ...getColumnSearchProps("firstName"),
        },
        {
            title: 'Branch',
            dataIndex: 'branch_name',
            key: 'firstName',
            ...getColumnSearchProps("branch_name"),
        },
        {
            title: 'Division',
            dataIndex: 'division_name',
            key: 'firstName',
            ...getColumnSearchProps("division_name"),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            sorter: (a, b) => a.department.localeCompare(b.department),
            ...getColumnSearchProps("department"),
        },
        {
            title: 'Shift Group',
            dataIndex: 'shiftGroup',
            key: 'shiftGroup',
            sorter: (a, b) => a.shiftGroup.localeCompare(b.shiftGroup),
            ...getColumnSearchProps("shiftGroup"),
        },
    ];

    return (
        <>
            <PageContainer title='Employee Shift-Mapping' breadcrumbRender={false}>
                <Form layout='vertical' form={form} >
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={5}>
                            <Form.Item name={'branch'} label={'Branch'}

                            // rules={[{required:true,message:'Branch is Required'}]}
                            >
                                <Select showSearch allowClear>
                                    {branch.map(drop => {
                                        return <Option key={drop.branchId} value={drop.branchId}>{drop.branchName}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={5}>
                            <Form.Item name={'division'} label={'Division'}

                            >
                                <Select showSearch allowClear>
                                    {division.map(drop => {
                                        return <Option key={drop.id} value={drop.id}>{drop.divisionName}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Form.Item name={'department'} label={'Department'}
                            >
                                <Select showSearch allowClear>
                                    {departments.map(drop => {
                                        return <Option key={drop.id} value={drop.id}>{drop.departmentName}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={3}>
                            <Form.Item
                                name="shiftGroup"
                                label="Shift Group"
                            >
                                <Select
                                    placeholder="Select Shift Group Code"
                                    allowClear
                                    style={{ width: '100%' }}
                                >
                                    {Object.values(ShiftGroupEnum).map((shiftCode) => (
                                        <Option key={shiftCode} value={shiftCode}>
                                            {shiftCode}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                // size="small"
                                block onClick={() => getAllEmployeeData()}
                                style={{ marginRight: 2, width: 100, marginTop: "20px" }}
                            >
                                Search
                            </Button>

                            <Button
                                icon={<UndoOutlined />}
                                onClick={() => onReset()}
                            >
                                Reset
                            </Button>
                        </Col>
                    </Row> <Row>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }} lg={{ span: 5 }} xl={{ span: 5 }} style={{ margin: '1%' }}>
                            <Form.Item
                                name="newShiftGroup"
                                label="New Shift Group"
                                rules={[
                                    {
                                        required: true,
                                        message: "Select New Shift Group"
                                    }
                                ]}>

                                <Select
                                    placeholder="Select Shift Group Code"
                                    allowClear
                                    style={{ width: '100%' }}
                                >
                                    {Object.values(ShiftGroupEnum).map((shiftCode) => (
                                        <Option key={shiftCode} value={shiftCode}>
                                            {shiftCode}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24} style={{ textAlign: 'right' }}>
                            {isTableDisabled && empData.length ? <>
                                <Button type="primary" htmlType="submit" onClick={updateLogs}>
                                    Submit
                                </Button>

                                <Button htmlType="button" style={{ margin: '0 14px' }} onClick={onReset1}>
                                    Reset
                                </Button>
                            </> : ""}
                        </Col>
                    </Row>
                    <div className="table-container">

                        {isTableDisabled && (
                            <Table
                                rowSelection={{
                                    ...rowSelection
                                }}
                                columns={columns}
                                dataSource={empData}
                                size="small"
                                rowKey={(record) => record.employeeId}
                                pagination={false}
                            />
                        )}
                    </div>
                </Form>
            </PageContainer>



        </>
    )
}
export default EmployeeShiftMapping;