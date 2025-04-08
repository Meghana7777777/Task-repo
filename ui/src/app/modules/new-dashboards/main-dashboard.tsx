import { DashboardReq } from '@hrexpert/shared-models';
import {
  BranchesMappingSharedService,
  BranchesService,
  DepartmentService,
  DivisionService,
  EmployeeOnboardingService,
  EmployeeTypeService,
} from '@hrexpert/shared-services';
import { Affix, Card, Col, Form, Row, Select, Spin, message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AttendanceCard from './attendance-card';
import BirthdayCard from './birthday-card';
import BranchAttendance from './branch-attendance';
import EmployeeGenderAgeChart from './emp-by-agegroup';
import EmployeeTenureGenderChart from './emp-by-tenure';
import HeadCount from './head-count';
import WeeklyAttendance from './weekly-atd';
import { useIAMClientState } from '../../common/iam-client-react/iam-client';
import PayrollStatistics from './payroll-stat';
import PayrollHeadcount from './payroll-headcount';
import ReportingManagerWiseAttn from './reporting-manager-wise-attendance';

const MainDashboard = () => {
  const [form] = Form.useForm();
  const branchService = new BranchesService();
  const empTypeService = new EmployeeTypeService();
  const empService = new EmployeeOnboardingService();

  const [loading, setLoading] = useState(true);
  const [branchData, setBranchData] = useState([]);
  const [divisionData, setDivisionData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [empTypeData, setEmpTypeData] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState<number | undefined>();
  const [selectedDiv, setSelectedDiv] = useState<number | undefined>();
  const [selectedDept, setSelectedDept] = useState<number | undefined>();
  const [selectedEmpType, setSelectedEmpType] = useState<number | undefined>();
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  const unitId = IAMClientAuthContext.user.unitId;
  const numericUnitId = Number(unitId);

  const commonProps = {
    branchId: selectedBranch,
    divisionId: selectedDiv,
    departmentId: selectedDept,
    empTypeId: selectedEmpType,
  };

  const fetchDropdownData = useCallback(async () => {
    try {
      setLoading(true);
      const [branches, empTypes, divisions, departments] = await Promise.all([
        branchService.getActiveBranches(),
        empTypeService.getActiveEmployeeType(),
        empService.getDivisionByBranchId(),
        empService.getDepartmentByBranchId(),
      ]);

      setBranchData(branches.status ? branches.data : []);
      setEmpTypeData(empTypes.status ? empTypes.data : []);
      setDivisionData(divisions.status ? divisions.data : []);
      setDeptData(departments.status ? departments.data : []);

      if (IAMClientAuthContext.user.roles === 'SuperAdmin') {
        setSelectedBranch(undefined);
        form.setFieldsValue({
          unitName: '',
          divisionId: undefined,
          deptId: undefined,
          empType: undefined,
        });
      } else {
        setSelectedBranch(numericUnitId);
        form.setFieldsValue({ unitName: numericUnitId });

        const req = new DashboardReq(numericUnitId);
        const [divisions, departments] = await Promise.all([
          empService.getDivisionByBranchId(req),
          empService.getDepartmentByBranchId(req),
        ]);

        setDivisionData(divisions.status ? divisions.data : []);
        setDeptData(departments.status ? departments.data : []);
      }
    } catch (error) {
      message.error('Failed to load data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [form, numericUnitId, IAMClientAuthContext.user.roles]);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  const renderSelectOptions = useMemo(
    () => (data, key, label) =>
      data.map((item) => (
        <Select.Option key={item[key]} value={item[key]}>
          {item[label]}
        </Select.Option>
      )),
    []
  );

  const handleFilterChange = useCallback(
    (setter, fieldName) => async (value) => {
      setter(value);

      if (
        fieldName === 'unitName' &&
        IAMClientAuthContext.user.roles === 'SuperAdmin'
      ) {
        try {
          setLoading(true);
          form.setFieldsValue({
            divisionId: undefined,
            deptId: undefined,
          });
          setSelectedDiv(undefined);
          setSelectedDept(undefined);

          if (value) {
            const req = new DashboardReq(value);
            const [divisions, departments] = await Promise.all([
              empService.getDivisionByBranchId(req),
              empService.getDepartmentByBranchId(req),
            ]);

            setDivisionData(divisions.status ? divisions.data : []);
            setDeptData(departments.status ? departments.data : []);
          } else {
            const [divisions, departments] = await Promise.all([
              empService.getDivisionByBranchId(),
              empService.getDepartmentByBranchId(),
            ]);

            setDivisionData(divisions.status ? divisions.data : []);
            setDeptData(departments.status ? departments.data : []);
          }
        } catch (error) {
          message.error('Failed to load division and department data.');
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    },
    [form, empService, IAMClientAuthContext.user.roles]
  );

  return (
    <Spin spinning={loading}>
      <Affix offsetTop={55}>
        <Card>
          <Form form={form} layout="horizontal">
            <Row gutter={24}>
              {[
                {
                  name: 'unitName',
                  label: 'Branch',
                  data: branchData,
                  setter: setSelectedBranch,
                  key: 'id',
                  labelKey: 'branchName',
                  initialValue:
                    IAMClientAuthContext.user.roles === 'SuperAdmin'
                      ? ''
                      : numericUnitId,
                },
                {
                  name: 'divisionId',
                  label: 'Division',
                  data: divisionData,
                  setter: setSelectedDiv,
                  key: 'id',
                  labelKey: 'divisionName',
                },
                {
                  name: 'deptId',
                  label: 'Department',
                  data: deptData,
                  setter: setSelectedDept,
                  key: 'id',
                  labelKey: 'departmentName',
                },
                {
                  name: 'empType',
                  label: 'Employee Type',
                  data: empTypeData,
                  setter: setSelectedEmpType,
                  key: 'id',
                  labelKey: 'name',
                },
              ].map(
                ({
                  name,
                  label,
                  data,
                  setter,
                  key,
                  labelKey,
                  initialValue,
                }) => (
                  <Col xs={24} sm={12} md={6} key={name}>
                    <Form.Item
                      name={name}
                      label={label}
                      initialValue={initialValue}
                    >
                      <Select
                        showSearch
                        optionFilterProp="children"
                        placeholder={`Select ${label}`}
                        allowClear={
                          IAMClientAuthContext.user.roles === 'SuperAdmin' ||
                          name !== 'unitName'
                        }
                        style={{ width: '100%' }}
                        onChange={handleFilterChange(setter, name)}
                        disabled={
                          name === 'unitName' &&
                          IAMClientAuthContext.user.roles !== 'SuperAdmin'
                        }
                      >
                        {IAMClientAuthContext.user.roles === 'SuperAdmin' &&
                          name === 'unitName' && (
                            <Select.Option key="all" value="">
                              All
                            </Select.Option>
                          )}
                        {renderSelectOptions(data, key, labelKey)}
                      </Select>
                    </Form.Item>
                  </Col>
                )
              )}
            </Row>
          </Form>
        </Card>
      </Affix>
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <HeadCount {...commonProps} />
          </Col>
          <Col xs={24} md={12}>
            <AttendanceCard {...commonProps} />
          </Col>
          <Col xs={24} md={12}>
            <BirthdayCard {...commonProps} />
          </Col>
          <Col xs={24} md={12}>
            <WeeklyAttendance {...commonProps} />
          </Col>
          <Col xs={24} md={12}>
            <EmployeeTenureGenderChart {...commonProps} />
          </Col>
          <Col xs={24} md={12}>
            <EmployeeGenderAgeChart {...commonProps} />
          </Col>
          <Col xs={24}>
            <BranchAttendance {...commonProps} />
          </Col>
          {/* <Col xs={24}>
            <ReportingManagerWiseAttn {...commonProps} />
          </Col> */}
          <Col xs={24} md={12}>
            <PayrollStatistics {...commonProps} />
          </Col>
          <Col xs={24} md={12}>
            <PayrollHeadcount {...commonProps} />
          </Col>
        </Row>
      </Card>
    </Spin>
  );
};

export default React.memo(MainDashboard);
