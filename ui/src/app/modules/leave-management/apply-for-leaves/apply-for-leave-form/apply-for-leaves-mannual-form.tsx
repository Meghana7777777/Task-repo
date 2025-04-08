import { UndoOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { AlertMessages, ApplyForLeavesReqModel, ApplyForLeaveStatusEnum, ApplyLeaveBrachDto, ApplyLeavesReq, BranchReq, LeaveAllocationReqDto } from "@hrexpert/shared-models";
import { ApplForLeavesSharedService, BranchesService, EmployeeOnboardingService, EmployeeTypeService, LeaveAllocationService, LeaveGroupsService, LeavePolicyService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Space, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../../../../styles.css';
import { useIAMClientState } from '../../../../common/iam-client-react';

export interface ApplyForLeavesFormProps {
    applyForLeavesData: ApplyForLeavesReqModel;
    updateDetails?: (hrms: ApplyForLeavesReqModel) => void;
    isUpdate?: boolean;
    closeForm?: () => void;
}

export function ApplyForLeavesManualForm(
    props: ApplyForLeavesFormProps
) {
    const [form] = Form.useForm();
    const employeeTypesService = new EmployeeTypeService()
    const [employeeTypes, setEmployeeTypes] = useState([])
    const [employeeData, setEmployeeData] = useState([]);
    const [holidaysData, setHolidaysData] = useState([]);
    const [weekOfData, setWeekOffData] = useState([]);
    const [attStatus, setAttStatus] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [leaveToDay, setLeaveToDay] = useState(null);
    const [leaveFromDay, setLeaveFromDay] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [typesOfLeaveData, setTypesOfLeavesData] = useState<any[]>([]);
    const [leaveAllocations, setLeaveAllocations] = useState<any[]>([]);
    const [availableLeaves, setAvailableLeaves] = useState<number>(0);
    const [maxLeaves, setmaxLeaves] = useState<number>(0);
    const [minLeaves, setminLeaves] = useState<number>(0);
    const branchService = new BranchesService()
    const [branches, setBranches] = useState<any>([]);
    const [filteredHolidays, setFilteredHolidays] = useState([]);

    const service = new ApplForLeavesSharedService()
    const { Option } = Select;
    const leaveAllocationservice = new LeaveAllocationService()
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [data, setData] = useState<any>([]);
    const leavePolicySerivce = new LeavePolicyService()
    const employeeDetails = new EmployeeOnboardingService()
    useEffect(() => {
        getActiveEmployeesById()
        getHolidaysDateFromHolidayMaster()
        getAllTypesOfLeavesData()
        getEmployeeTypes()
        getAppliedForLeaves()
        getAllBranches();
        if (IAMClientAuthContext.user.roles != "SuperAdmin") {
            // console.log(IAMClientAuthContext.user.roles, '-------uuuuuu----------')
            getActiveEmployeesById(Number(IAMClientAuthContext.user.unitId))
        }
    }, [])

    const getAllBranches = () => {
        try {
            branchService.getActiveBranches().then((res) => {
                if (res.status) {
                    setBranches(res.data);
                } else {
                    console.log("Failed to fetch branches");
                    setBranches([])
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    // const handleBranchChange = (branchId: number) => {
    //     const branchRequest = new BranchReq(branchId);
    //     employeeDetails.getEmpDetailsByBranch(branchRequest).then((res) => {
    //         if (res.status) {
    //             setEmployeeData(res.data);
    //         } else {
    //             setEmployeeData([]);
    //         }
    //     });
    //     const branchHolidays = holidaysData.filter(holiday => holiday.branchId === branchId);
    //     setFilteredHolidays(branchHolidays);
    // };

    const getEmployeeTypes = () => {
        employeeTypesService.getActiveEmployeeType().then((res) => {
            if (res.status) {
                setEmployeeTypes(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const getActiveEmployeesById = (branchId?: number) => {
        try {
            const req = new ApplyLeaveBrachDto
            if (role === 'SuperAdmin') {
                if (form.getFieldValue('branches') !== undefined) {
                    req.branchId = form.getFieldValue('branches');
                }
            } else {
                req.branchId = IAMClientAuthContext.user?.unitId || null;
            }
            service.getActiveEmployeesByIds(req).then((res) => {
                if (res.status) {
                    setEmployeeData(res.data.data)
                }
            })
            const branchHolidays = holidaysData.filter(holiday => holiday.branchId === branchId);
        setFilteredHolidays(branchHolidays);
        } catch (err) {
            console.log(err);
        }
    }

    const getAppliedForLeaves = () => {
        const req = new ApplyLeavesReq();
        const formValues = form.getFieldsValue();

        if (formValues.selectedMonth) {
            const selectedDate = formValues.selectedMonth;
            req.selectedMonth = selectedDate.month() + 1;
            req.selectedYear = selectedDate.year();
        }
        if (formValues.employeeName) {
            req.employeeId = formValues.employeeName;
        }
        try {
            service.getAppliedForLeaves(req).then((res) => {
                if (res.status) {
                    setData(res.data);
                } else {
                    message.error("Failed to retrieve data");
                }
            });
        } catch (error) {
            console.error(error);
            message.error("Error fetching leave data");
        } finally {

        }
    }

    const getAllTypesOfLeavesData = () => {
        try {
            leavePolicySerivce.getActiveLeaveType().then((res) => {
                if (res.status) {
                    setTypesOfLeavesData(res.data)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getAllLeaveAllocationsData = (values) => {
        const req = new LeaveAllocationReqDto()
        req.empolyeeId = values
        try {
            leaveAllocationservice.getAllLeaveAllocationsLeaveTypes(req).then((res) => {
                if (res.status) {
                    setLeaveAllocations(res.data)
                }else{
                    setLeaveAllocations([])
                    message.warning('Leaves yet to be allocated',2)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getHolidaysDateFromHolidayMaster = () => {
        try {
            service.getHolidaysDateFromHolidayMaster().then((res) => {
                if (res.status) {
                    setHolidaysData(res.data)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const disableHolidayDates = (date) => {
        return filteredHolidays.some(holiday =>
            holiday.holidayType.includes("HOLIDAY") &&
            date.isSame(moment(holiday.holidayDate, 'DD-MM-YYYY'), 'day')
        );
    };

    const disableSpecificWeekday = (date) => {
        return filteredHolidays.some(holiday =>
            holiday.holidayType === "WEEK OFF" &&
            date.isSame(moment(holiday.holidayDate, 'DD-MM-YYYY'), 'day')
        );
    };

    const getDateStyle = (date) => {
        const baseStyle = {
            display: 'inline-block',
            width: '30px',
            height: '30px',
            lineHeight: '30px',
            textAlign: 'center',
            borderRadius: '50%',
        };
        const isHoliday = disableHolidayDates(date);
        const isWeekOff = disableSpecificWeekday(date);
        if (isHoliday && isWeekOff) {
            return { ...baseStyle, backgroundColor: 'blue', color: 'white' }
        }
        if (isHoliday) {
            return { ...baseStyle, backgroundColor: 'red', color: 'white' }
        }
        if (isWeekOff) {
            return { ...baseStyle, backgroundColor: 'green', color: 'white' }
        }
        return {};
    };

    const handleSelectEmployeeName = (value, Option) => {
        const selectedEmp = employeeData.find((item) => item.employeeCode === value.value);
        if (selectedEmp) {
            form.setFieldsValue({ employeeCode: selectedEmp.employeeCode });
            form.setFieldsValue({ employeeTypeId: selectedEmp.employeeTypeName });
            setSelectedEmployee(selectedEmp);
            setAvailableLeaves(0);
            setmaxLeaves(0);
            setminLeaves(0)
            form.setFieldsValue({ typeOfLeave: null });
            getAllLeaveAllocationsData(Option?.empId)
        } else {
            form.setFieldsValue({ employeeCode: null, typeOfLeave: null });
            setSelectedEmployee(null);
            setAvailableLeaves(0);
            setmaxLeaves(0);
            setminLeaves(0)
        }
    };

    const handleSelectLeaveType = (leaveTypeId) => {
        if (selectedEmployee) {
            const allocation = leaveAllocations.find((rec) =>
                rec.employeeId === selectedEmployee.id &&
                rec.leaveTypeId === leaveTypeId
            );
            setAvailableLeaves(allocation ? allocation.available : 0);
            setmaxLeaves(allocation ? allocation.maxLimit : 0);
            setminLeaves(allocation ? allocation.minLimit : 0)
        }
    }

    const updateLeaveAllocations = (req: any) => {
        leaveAllocationservice.updateLeaveAllocations(req).then((res) => {
            if (res.status) {
            }
        })
    }

    const createManualLeave = (val: ApplyForLeavesReqModel) => {
        const employee = employeeData.find(emp => emp.employeeCode === val.employeeCode);
        const req = new ApplyForLeavesReqModel();
        req.employeeCode = employee.employeeCode
        req.employeeName = employee.employeeName
        req.employeeId = employee.empId
        req.typeOfLeave = val.typeOfLeave
        req.fromDate = val.fromDate
        req.toDate = val.toDate
        req.leaveFromDay = val.leaveFromDay
        req.leaveToDay = val.leaveToDay
        req.noOfDays = val.noOfDays
        req.leaveReason = val.leaveReason
        req.leaveAddress = val.leaveAddress
        req.status = ApplyForLeaveStatusEnum.OPEN
        service.createManualLeave(req).then((res) => {
            if (res.status) {
                const updateReq = {
                    employeeId: req.employeeId,
                    noOfDays: req.noOfDays,
                    typeOfLeave: req.typeOfLeave,
                };
                if (updateReq) {
                    updateLeaveAllocations(updateReq);
                    form.resetFields()
                    setAvailableLeaves(0)
                    setmaxLeaves(0);
                    setminLeaves(0)
                    getAllTypesOfLeavesData()
                    AlertMessages.getSuccessMessage('Leave applied successfully');
                }
            } else {
                if (res.status) {
                    AlertMessages.getErrorMessage(res.internalMessage);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })
    }

    const onReset = () => {
        form.resetFields();
        setAvailableLeaves(0)
        setmaxLeaves(0);
        setminLeaves(0)
        setBranches([])
        getAllBranches()
    }

    const handleFromDateChange = (date) => {
        setFromDate(date);
        if (date && toDate) {
            calculateDateRange(date, toDate, leaveFromDay, leaveToDay,);
            form.setFieldsValue({ leaveFromDay: 'Full Day', leaveToDay: 'Full Day' });
        }
    };

    const handleToDateChange = (date) => {
        setToDate(date);
        if (fromDate && date) {
            calculateDateRange(fromDate, date, leaveFromDay, leaveToDay);
            form.setFieldsValue({ leaveFromDay: 'Full Day', leaveToDay: 'Full Day' });
        }
        // form.setFieldsValue({ leaveFromDay: undefined, leaveToDay: undefined })
    };

    const handleLeaveFromDayChange = (value) => {
        setLeaveFromDay(value);
        if (fromDate && toDate) {
            calculateDateRange(fromDate, toDate, value, leaveToDay);
        }
    };

    const handleLeaveToDayChange = (value) => {
        setLeaveToDay(value);
        if (fromDate && toDate) {
            calculateDateRange(fromDate, toDate, leaveFromDay, value);
        }
    };

    const calculateDateRange = (start, end, leaveFromDay, leaveToDay) => {
        const firstDate = dayjs(start, 'DD-MM-YYYY');
        const secondDate = dayjs(end, 'DD-MM-YYYY');
        const dateRangeFromDateToDate = [];
        for (let date = firstDate; date.isBefore(secondDate) || date.isSame(secondDate); date = date.add(1, 'day')) {
            dateRangeFromDateToDate.push(date.format('DD-MM-YYYY'));
        }
        const publicHolidayDates = new Set(holidaysData.map(holiday => holiday.holidayDate));
        const dateRange = [];
        let currentDate = firstDate;
        while (currentDate.isBefore(secondDate.add(1, 'day'), 'day')) {
            const formattedDate = currentDate.format('DD-MM-YYYY');
            const isHoliday = disableHolidayDates(currentDate);
            const isWeekdayOff = disableSpecificWeekday(currentDate);
            dateRange.push({
                date: formattedDate,
                isHoliday,
                isWeekdayOff
            });
            currentDate = currentDate.add(1, 'day');
        }
        const weekOfHolidays = dateRange
            .filter(day => day.isHoliday || day.isWeekdayOff)
            .map(day => ({
                weekOfDates: day.date,
                isHoliday: day.isHoliday,
                isWeekOf: day.isWeekdayOff,
            }));
        if (start && end) {
            let daysCount = secondDate.diff(firstDate, 'days') + 1;
            let leaveDaysCount = 0;

            if ((leaveFromDay === 'First Half' && leaveToDay === 'First Half') ||
                (leaveFromDay === 'Second Half' && leaveToDay === 'Second Half')) {
                leaveDaysCount = 0.5;
            } else if ((leaveFromDay === 'First Half' && leaveToDay === 'Second Half') ||
                (leaveFromDay === 'Full Day' && leaveToDay === 'Second Half')) {
                leaveDaysCount = 0;
            } else if ((leaveFromDay === 'Second Half' && leaveToDay === 'First Half')) {
                leaveDaysCount = 1;
            } else if ((leaveFromDay === 'First Half' && leaveToDay === 'Full Day') ||
                (leaveFromDay === 'Second Half' && leaveToDay === 'Full Day') ||
                (leaveFromDay === 'Full Day' && leaveToDay === 'First Half')) {
                leaveDaysCount = 0.5;
            } else if (leaveFromDay === 'Full Day' && leaveToDay === 'Full Day') {
                leaveDaysCount = 0;
            }

            daysCount -= leaveDaysCount;
            const holidaysAndWeekOfDates = dateRangeFromDateToDate.filter(date =>
                publicHolidayDates.has(date) || weekOfHolidays.some(w => w.weekOfDates === date)
            ).length;
            daysCount -= holidaysAndWeekOfDates;
            form.setFieldsValue({ noOfDays: daysCount });
        }
    };

    const saveData = (values: ApplyForLeavesReqModel) => {
        const noOfDays = form.getFieldValue('noOfDays');
        const leavesData = availableLeaves;
        const typeOfLeaveMinLimit = minLeaves;
        const typeOfLeaveMaxLimit = maxLeaves;

        // Validation checks
        // if (
        //     noOfDays > leavesData || 
        //     noOfDays < typeOfLeaveMinLimit || 
        //     noOfDays > typeOfLeaveMaxLimit
        // ) {
        //     AlertMessages.getErrorMessage(
        //         'No of Days cannot exceed available leaves, maximum allowed leave, or be less than the minimum allowed limit.'
        //     );
        //     return;
        // }
        if (noOfDays > leavesData) {
            AlertMessages.getErrorMessage('No of Days cannot exceed available leaves.');
        }

        if (noOfDays < typeOfLeaveMinLimit) {
            AlertMessages.getErrorMessage('No of Days cannot be less than the minimum allowed limit.');
        }

        if (noOfDays > typeOfLeaveMaxLimit) {
            AlertMessages.getErrorMessage('No of Days cannot exceed the maximum allowed leave.');
        }

        if (
            noOfDays > leavesData ||
            noOfDays < typeOfLeaveMinLimit ||
            noOfDays > typeOfLeaveMaxLimit
        ) {
            return; // Prevent further processing if any condition fails
        }


        // Save or update data
        if (props.isUpdate) {
            props.updateDetails(values);
        } else {
            createManualLeave(values);
        }
    };

    return (
        <>
            <PageContainer title='Leave Application' breadcrumbRender={false}
                extra={
                    <>
                        <Space style={{ marginRight: "40px" }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <div className="shine green"></div>
                                Week Offs
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <div className="shine red"></div>
                                Holidays
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <div className="shine blue"></div>
                                Both
                            </span>
                        </Space>
                        <Link to='/apply-for-leaves-excel-upload' >
                            <span style={{ color: 'white' }} >
                                <Button className='panel_button' style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed">Excel Upload </Button> </span>
                        </Link> &nbsp;&nbsp;
                    </>
                }
            >

                <Form form={form}
                    name="control-hooks"
                    layout="vertical"
                    onFinish={saveData}
                    initialValues={props.applyForLeavesData}

                >

                    <Form.Item name="applyForLeavesId" style={{ display: "none" }} >
                        <Input hidden />
                    </Form.Item>

                    <Form.Item style={{ display: "none" }} name="createdUser" >
                        <Input hidden />
                    </Form.Item>

                    <Form.Item style={{ display: "none" }} name="employeeId" >
                        <Input hidden />
                    </Form.Item>

                    <Row gutter={[24, 4]}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item label="Branch" name="branches"
                                initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : Number(IAMClientAuthContext.user.unitId)}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Select a Branch',
                                    },
                                ]}>
                                <Select showSearch disabled={role === 'SuperAdmin' ? false : true}
                                    allowClear
                                    placeholder="Select Branch"
                                    dropdownMatchSelectWidth={false}
                                    optionFilterProp="children"
                                    onChange={(value) => getActiveEmployeesById(value)}>
                                    {branches.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="employeeCode"
                                label="Employee Name"
                                rules={[{ required: true, message: "Employee Name is Required" }]}
                            >
                                <Select
                                    showSearch
                                    labelInValue
                                    disabled={props.isUpdate ? true : false}
                                    allowClear
                                    placeholder="Select Employee Name"
                                    optionFilterProp="children"
                                    onChange={handleSelectEmployeeName}
                                >
                                    {employeeData?.length > 0 ? (
                                        employeeData?.map((employee) => (
                                            <Option key={employee.employeeCode} value={employee.employeeCode} empId={employee.empId}>
                                                {`${employee.employeeName}-${employee.employeeCode}`}
                                            </Option>
                                        ))
                                    ) : (
                                        <Option disabled>Error In Employee Name</Option>
                                    )}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item label={'Employee Type'} name='employeeTypeId'>
                                <Input onChange={setSelectedEmployee} disabled={true}></Input>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                key={Date.now()}
                                name="typeOfLeave"
                                label={<span>Type of Leave || Available Leaves: <Tag color="green">{availableLeaves}</Tag> <Tag color="orange">Minimum Limit:{minLeaves}</Tag><Tag color="blue">Maximum Limit:{maxLeaves}</Tag></span>}
                                initialValue={props?.applyForLeavesData?.typeOfLeave}
                                rules={[{ required: true, message: "Type Of Leave is Required" }]}
                            >
                                <Select
                                    key={Date.now()}
                                    showSearch
                                    placeholder="Select Type of Leave"
                                    optionFilterProp="children"
                                    onChange={(value) => handleSelectLeaveType(value)}
                                >
                                    <Option key={0} value={null} disabled hidden> Select Type of Leave </Option>
                                    {leaveAllocations.map((type) => (
                                        <Option key={type.leaveTypeId} value={type.leaveTypeId}>
                                            {`${type.leaveCode
                                                }`}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>


                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="fromDate"
                                label="From Date"
                                rules={[{ required: true, message: "From Date is Required" }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="DD-MM-YYYY"
                                    disabledDate={(date) =>
                                        disableHolidayDates(date) ||
                                        disableSpecificWeekday(date)
                                    }
                                    onChange={handleFromDateChange}
                                    dateRender={(current) => (
                                        <div style={{ ...getDateStyle(current) }}>
                                            {current.date()}
                                        </div>
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="toDate"
                                label="To Date"
                                rules={[{ required: true, message: "To Date is Required" }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="DD-MM-YYYY"
                                    allowClear
                                    disabled={!fromDate}
                                    disabledDate={(date) =>
                                        (fromDate && date.isBefore(fromDate, 'day')) ||
                                        disableHolidayDates(date) ||
                                        disableSpecificWeekday(date)
                                    }
                                    onChange={(date) => {
                                        handleToDateChange(date);
                                        if (!date) {
                                            setFromDate(null);
                                        }
                                    }}
                                    dateRender={(current) => (
                                        <div style={{ ...getDateStyle(current) }}>
                                            {current.date()}
                                        </div>
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="leaveFromDay"
                                label="Leave From Day"
                                rules={[{ required: true, message: "Leave From Day is Required" }]}
                                // initialValue={'Full Day'}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select Leave From Day"
                                    onChange={handleLeaveFromDayChange}
                                >
                                    {(!fromDate || !toDate || dayjs(fromDate).isSame(toDate, 'day')) ? (
                                        <>
                                            <Option value="First Half">First Half</Option>
                                            <Option value="Second Half">Second Half</Option>
                                            <Option value="Full Day">Full Day</Option>
                                        </>
                                    ) : (
                                        <>
                                            <Option value="Second Half">Second Half</Option>
                                            <Option value="Full Day">Full Day</Option>
                                        </>
                                    )}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="leaveToDay"
                                label="Leave To Day"
                                rules={[{ required: true, message: "Leave To Day is Required" }]}
                                // initialValue={'Full Day'}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select Leave To Day"
                                    onChange={handleLeaveToDayChange}
                                >
                                    {(!fromDate || !toDate || dayjs(fromDate).isSame(toDate, 'day')) ? (
                                        <>
                                            <Option value="First Half">First Half</Option>
                                            <Option value="Second Half">Second Half</Option>
                                            <Option value="Full Day">Full Day</Option>
                                        </>
                                    ) : (
                                        <>
                                            <Option value="First Half">First Half</Option>
                                            <Option value="Full Day">Full Day</Option>
                                        </>
                                    )}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item name="noOfDays" label="No of Leave days" >
                                <Input disabled style={{ fontWeight: 'bold', color: "black" }} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item name="leaveReason"
                                rules={[{ required: true, message: "Leave Reason is Required" }]}
                                label="Reason">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item name="leaveAddress"
                                label="Leave Address">
                                <TextArea rows={2} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button htmlType="submit"  className="panel_button" style={{ color: "blue", fontWeight: "bold", borderColor: "blue" }}  type="dashed" >
                                Submit
                            </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button htmlType="button" onClick={onReset} icon={<UndoOutlined />} className="panel_button" style={{ color: "red", fontWeight: "bold", borderColor: "red" }}  type="dashed">
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </PageContainer>
        </>
    )

}