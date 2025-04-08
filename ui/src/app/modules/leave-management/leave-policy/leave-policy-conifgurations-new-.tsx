import { DeleteOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormColorPicker,
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import {
  CriteriaDisplay,
  CriteriaEnum,
  LeavePolicyTypeEnum,
  LeaveTypeDisplay,
  LeaveTypeEnum,
} from '@hrexpert/shared-models';
import { LeavePolicyService } from '@hrexpert/shared-services';
import { Button, Col, message, Row, Space, Typography } from 'antd';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const LeavePolicyMainOld = () => {
  const location = useLocation();
  const { policyType } = location.state || {};
  const navigate = useNavigate();
  const [unit, setUnit] = useState('days');
  const [reset, setReset] = useState('no');
  const [creditCycle, setCreditCycle] = useState('yearly');
  const [creditCycleEnd, setCreditCycleEnd] = useState('yearly');
  const [carryForward, setCarryForward] = useState([]);
  const [encash, setEncash] = useState([]);
  const [criteriaApplicable, setCriteriaApplicable] = useState<string[]>([]);
  const [criteriaException, setCriteriaException] = useState<string[]>([]);
  const [allowExceed, setAllowExceed] = useState<string[]>([]);
  const [exceedLimitOption, setExceedLimitOption] =useState<string>('withoutLimit');
  const [markAsLOP, setMarkAsLOP] = useState<boolean>(false);
  const [isSandwichPolicyEnabled, setIsSandwichPolicyEnabled] = useState(false);
  const [considerWeekends, setConsiderWeekends] = useState(true);
  const [considerHolidays, setConsiderHolidays] = useState(true);
  const [allowPastDates, setAllowPastDates] = useState(true);
  const [allowFutureDates, setAllowFutureDates] = useState(true);
  const [enableNextDays, setEnableNextDays] = useState(false);
  const [enableAdvanceDays, setEnableAdvanceDays] = useState(false);
  const leavePolicyService = new LeavePolicyService()
  const [checkboxState, setCheckboxState] = useState({
    minLeaveInput: false,
    maxLeaveInput: false,
    maxConsecutiveDays: false,
    minGapBetweenLeaves: false,
    enableNextDays: false,
    enableAdvanceDays: false,
  });

  const createLeavePolicy = (value)=>{
    leavePolicyService.createLeavePolicy(value).then((res)=>{
      if(res.status){
        message.success(res.internalMessage,2)
      }else{
        message.error(res.internalMessage,2)
      }
    })
  }

  const handleCheckboxChange = (field) => (e) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [field]: e.target.checked,
    }));
  };

  const steps = {
    [LeavePolicyTypeEnum.FIXED_ENTITLEMENT]: [
      { title: 'Details & Entitlement', name: 'detailsAndEntitlement' },
      { title: 'Applicability', name: 'applicability' },
      { title: 'Restrictions', name: 'restrictions' },
    ],
    [LeavePolicyTypeEnum.EXPERIENCE_BASED_ENTITLEMENT]: [
      { title: 'Details', name: 'details' },
      { title: 'Entitlement', name: 'entitlement' },
      { title: 'Applicability', name: 'applicability' },
      { title: 'Restrictions', name: 'restrictions' },
    ],
    [LeavePolicyTypeEnum.ATTENDANCE_BASED_ENTITLEMENT]: [
      { title: 'Details', name: 'details' },
      { title: 'Entitlement', name: 'entitlement' },
      { title: 'Applicability', name: 'applicability' },
      { title: 'Restrictions', name: 'restrictions' },
    ],
    [LeavePolicyTypeEnum.GRANT_BASED_ENTITLEMENT]: [
      { title: 'Details', name: 'details' },
      { title: 'Grant', name: 'grant' },
      { title: 'Applicability', name: 'applicability' },
      { title: 'Restrictions', name: 'restrictions' },
    ],
  };
  const currentSteps = steps[policyType] || [];

  const backToView = () => {
    navigate('/leave-policy');
  };

  const handleUnitChange = (e) => {
    setUnit(e?.target?.value);
  };
  const handleResetChange = (e) => {
    setReset(e?.target?.value);
  };

  const handleCreditCycleChange = (value) => {
    setCreditCycle(value);
  };

  const handleCreditCycleEndChange = (value) => {
    setCreditCycleEnd(value);
  };

  const handleCarryForwardChange = (checkedValues) => {
    setCarryForward(checkedValues);
  };

  const handleEncashChange = (checkedValues) => {
    setEncash(checkedValues);
  };

  const handleAddCriteriaApplicable = () => {
    const newCriterion = Object?.values(CriteriaEnum).find(
      (type) =>
        !criteriaApplicable?.includes(type) && !criteriaException.includes(type)
    );
    if (newCriterion) {
      setCriteriaApplicable([...criteriaApplicable, newCriterion]);
    }
  };

  const handleCriteriaApplicableChange = (value: string, index: number) => {
    const updatedCriteria = [...criteriaApplicable];
    updatedCriteria[index] = value;
    setCriteriaApplicable(updatedCriteria);
  };

  const handleDeleteCriteriaApplicable = (index: number) => {
    setCriteriaApplicable(criteriaApplicable?.filter((_, i) => i !== index));
  };

  const availableOptionsToApplicable = Object.values(CriteriaEnum).filter(
      (type) =>
        !criteriaApplicable.includes(type) && !criteriaException.includes(type)
    ).map((type) => ({
      label: CriteriaDisplay[type],
      value: type,
    }));

  const handleAddCriteriaException = () => {
    const newCriterion = Object.values(CriteriaEnum).find(
      (type) =>
        !criteriaException?.includes(type) &&
        !criteriaApplicable?.includes(type) &&
        type !== CriteriaEnum?.GENDERS &&
        type !== CriteriaEnum?.MARITAL_STATUS
    );
    if (newCriterion) {
      setCriteriaException([...criteriaException, newCriterion]);
    }
  };

  const handleCriteriaExceptionChange = (value: string, index: number) => {
    const updatedCriteria = [...criteriaException];
    updatedCriteria[index] = value;
    setCriteriaException(updatedCriteria);
  };

  const handleDeleteCriteriaException = (index: number) => {
    setCriteriaException(criteriaException?.filter((_, i) => i !== index));
  };

  const availableOptionsToException = Object.values(CriteriaEnum).filter(
      (type) =>
        !criteriaException?.includes(type) &&
        !criteriaApplicable?.includes(type) &&
        type !== CriteriaEnum?.GENDERS &&
        type !== CriteriaEnum?.MARITAL_STATUS
      ).map((type) => ({
      label: CriteriaDisplay[type],
      value: type,
    }));

  const handleAllowExceedChange = (values: string[]) => {
    setAllowExceed(values);
  };

  const handleExceedLimitChange = (e: any) => {
    setExceedLimitOption(e?.target?.value);
  };

  const handleMarkAsLOPChange = (e: any) => {
    setMarkAsLOP(e?.target?.checked);
  };


  const transformFormData = (values) => {
    return {
      policyType: policyType || "enum",
      id: 0,
      leaveName: values?.name || "",
      color: values?.color || "",
      leaveCode: values?.code || "",
      leaveType: values?.type || "enum",
      uom: values?.unit || "",
      creditDays: Number(values?.credit) || 0,
      creditCycle: values?.creditCycle || "enum",
      reset: values?.reset || "",
      creditCycleEnd: values?.creditCycleEnd || 0,
      carryForwardInput: Number(values?.carryForwardInput) || 0,
      encashInput: Number(values?.encashInput) || 0,
      description: values?.description || "",
      validFrom: values?.validFrom || "",
      validTo: values?.validUntil || "",
      applicability: {
        eligibleFor: Object.keys(values)
          .filter(key => key.startsWith('applicableTo-'))
          .map(key => ({
            applicableTo: values[key] || "",
            applicableCriteria: values?.applicableCriteria || []
          })),
        exceptionFor: Object.keys(values)
          .filter(key => key.startsWith('exceptionTo-'))
          .map(key => ({
            exceptionTo: values[key] || "",
            exceptionCriteria: values?.exceptionCriteria || []
          }))
      },
      restrictions: {
        exceedLeaves: {
          allowExceed: values?.allowExceed?.[0] || "",
          exceedLimitOption: values?.exceedLimitOption || "",
          markAsLop: values?.markAsLOP?.[0] || ""
        },
        sandwichPolicy: {
          isSandwichPolicyEnabled: values?.isSandwichPolicyEnabled || "",
          considerWeekends: values?.considerWeekends?.[0] || "",
          countWeekendsAfter: Number(values?.countWeekendAfter) || 0,
          considerHolidays: values?.considerHolidays?.[0] || "",
          countHolidaysAfter: values?.countHolidaysAfter || "",
          clubbingPolicy: values?.clubbingPolicy || [],
          reports: {
            reportsData: values?.reportData || "",
            balanceDisplay: values?.balanceDisplay || ""
          },
          fileUpload: {
            uploadDoc: values?.uploadDoc?.[0] || "",
            uploadDocExceedLeaves: Number(values?.uploadDocExceedLeaves) || 0
          },
          recordLevelRestrictions: {
            allowedDurations: values?.allowedDurations || [],
            allowPastDays: values?.allowPastDays || "",
            pastDaysInput: values?.pastDaysInput || "",
            allowFutureDays: values?.allowFutureDates || "",
            enableAdvanceDays: Number(values?.enableAdvanceDays) || 0,
            advanceDaysInput: Number(values?.advanceDaysInput) || 0,
            adminOnly: values?.adminOnly || "",
            minLeaveInput: values?.minLeaveInput || "",
            minLeaveValue: Number(values?.minLeaveValue) || 0,
            maxLeaveInput: values?.maxLeaveInput || "",
            maxLeaveValue: Number(values?.maxLeaveValue) || 0,
            maxConsecutiveDays: values?.maxConsecutiveDays || "",
            maxConsecutiveDaysValue: Number(values?.maxConsecutiveDaysValue) || 0,
            minGapBetweenLeaves: values?.minGapBetweenLeaves || "",
            minGapBetweenLeavesValue: Number(values?.minGapBetweenLeavesValue) || 0,
            maxRequestsValue: Number(values?.maxRequestsValue) || 0,
            requestPeriod: values?.requestPeriod || "",
            leaveApplicationDays: values?.leaveApplicationDays || []
          }
        }
      }
    };
  };

  return (
    <ProCard
      title={'Add Leave Policy'}
      extra={
        <Button type="primary" onClick={backToView}>
          View
        </Button>
      }
      headerBordered
      bordered
    >
      <StepsForm
        onFinish={async (values) => {
          const transformedData = transformFormData(values);
          console.log(transformedData, 'Final Values');
          createLeavePolicy(transformedData)
          await waitTime(1000);
          message.success('Submission Successful');
        }}
        formProps={{
          validateMessages: {
            required: 'This field is required',
          },
        }}
      >
        {currentSteps.map((step) => (
          <StepsForm.StepForm
            key={step.name}
            name={step.name}
            title={step.title}
            onFinish={async () => {
              console.log(`${step.title} completed`);
              await waitTime(2000);
              return true;
            }}
          >
            {(step.name === 'detailsAndEntitlement' || step.name === 'details') && (
              <>
                <ProCard
                  title={
                    <>
                      {policyType === LeavePolicyTypeEnum.FIXED_ENTITLEMENT ? 'Details & Entitlement' : 'Details' }
                      <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                        {policyType === LeavePolicyTypeEnum.FIXED_ENTITLEMENT ? 'Enter the basic details and set the entitlement options of this policy' : 'Enter the basic details of this policy' }
                      </p>
                    </>
                  }
                  bordered
                  headerBordered
                  style={{
                    marginBlockEnd: 16,
                    minWidth: '100%',
                    maxWidth: '100%',
                  }}
                >
                  <ProForm.Group size={8}>
                    <Space.Compact>
                      <ProFormText
                        width="sm"
                        name="name"
                        label="Name"
                        placeholder="Enter Policy Name"
                        rules={[{ required: true }]}
                      />
                      <ProFormColorPicker name="color" label="Color" />
                    </Space.Compact>
                    <ProFormText
                      width="sm"
                      name="code"
                      label="Code"
                      placeholder="Enter Policy Code"
                      rules={[{ required: true }]}
                    />
                    <ProFormSelect
                      width="sm"
                      name="type"
                      label="Type"
                      placeholder="Select Type"
                      options={Object.values(LeaveTypeEnum).map((type) => ({
                        label: LeaveTypeDisplay[type],
                        value: type,
                      }))}
                      rules={[{ required: true }]}
                      initialValue={LeaveTypeEnum.PAID}
                    />
                    <ProFormRadio.Group
                      name="unit"
                      label="Unit"
                      options={[
                        { label: 'Days', value: 'days' },
                        { label: 'Hours', value: 'hours' },
                      ]}
                      initialValue="days"
                      fieldProps={{
                        onChange: handleUnitChange,
                      }}
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormText
                      width="xs"
                      name="credit"
                      label="Credit"
                      placeholder="e.g. 2"
                      initialValue={0}
                      rules={[{ required: true }]}
                      fieldProps={{
                        addonAfter: unit,
                      }}
                    />
                    <ProFormSelect
                      name="creditCycle"
                      label="Credit Cycle"
                      options={[
                        { label: 'Yearly', value: 'yearly' },
                        { label: 'Monthly', value: 'monthly' },
                      ]}
                      initialValue="yearly"
                      allowClear={false}
                      fieldProps={{
                        onChange: handleCreditCycleChange,
                      }}
                    />
                    <span
                      style={{
                        margin: '23px 10px',
                        alignSelf: 'flex-start',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                      }}
                    >
                      {creditCycle === 'yearly'
                        ? 'on 1st of Jan'
                        : 'on 1st of Month'}
                    </span>
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormRadio.Group
                      name="reset"
                      label={'Reset'}
                      options={[
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' },
                      ]}
                      initialValue={'no'}
                      fieldProps={{
                        onChange: handleResetChange,
                      }}
                    />
                    <ProFormSelect
                      name="creditCycleEnd"
                      label="Credit Cycle End"
                      options={[
                        { label: 'Yearly', value: 'yearly' },
                        { label: 'Monthly', value: 'monthly' },
                      ]}
                      initialValue="yearly"
                      allowClear={false}
                      fieldProps={{
                        onChange: handleCreditCycleEndChange,
                      }}
                    />
                    <span
                      style={{
                        margin: '23px 10px',
                        alignSelf: 'flex-start',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                      }}
                    >
                      {creditCycleEnd === 'yearly'
                        ? 'on 31st of Dec'
                        : 'on last day of Month'}
                    </span>
                  </ProForm.Group>
                  <ProForm.Group>
                    {reset === 'yes' && (
                      <>
                        <ProForm.Group>
                          <ProFormCheckbox.Group
                            options={[
                              {
                                label: 'Carry forward unused leave upto',
                                value: 'carryForward',
                              },
                            ]}
                            fieldProps={{
                              value: carryForward,
                              onChange: handleCarryForwardChange,
                            }}
                          />
                          <ProFormText
                            width={'xs'}
                            name="carryForwardInput"
                            placeholder="Enter value for Carry forward leave"
                            disabled={!carryForward.includes('carryForward')}
                            initialValue={0}
                            allowClear={false}
                          />
                        </ProForm.Group>
                        <ProForm.Group>
                          <ProFormCheckbox.Group
                            options={[
                              {
                                label: 'Encash unused leave upto',
                                value: 'encash',
                              },
                            ]}
                            fieldProps={{
                              value: encash,
                              onChange: handleEncashChange,
                            }}
                          />
                          <ProFormText
                            width={'xs'}
                            name="encashInput"
                            placeholder="Enter value for Encash unused leave"
                            disabled={!encash.includes('encash')}
                            fieldProps={{
                              type: 'number',
                            }}
                            initialValue={0}
                            allowClear={false}
                          />
                        </ProForm.Group>
                      </>
                    )}
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormTextArea
                      width={'md'}
                      name="description"
                      label="Description"
                      placeholder="Enter Description"
                    />
                  </ProForm.Group>
                </ProCard>
                <ProCard
                  title="Policy Validity"
                  bordered
                  headerBordered
                  style={{
                    minWidth: 800,
                    marginBlockEnd: 16,
                    maxWidth: '100%',
                  }}
                >
                  <Text>Enter a start and expiry date for this policy</Text>
                  <ProForm.Group>
                    <ProFormDatePicker
                      width={'sm'}
                      name="validFrom"
                      label="Valid From"
                      rules={[{ required: true }]}
                      placeholder="Select Start Date"
                      extra="Leave reports will be generated from this date and it can't be changed"
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormDatePicker
                      width={'sm'}
                      name="validUntil"
                      label="Expires On"
                      placeholder="Select Expiry Date"
                      extra="If this is a recurring policy, this field can be left blank"
                    />
                  </ProForm.Group>
                </ProCard>
              </>
            )}
            {step.name === 'entitlement' && (
              <ProForm.Group>
                <ProCard 
                  headerBordered
                  bordered
                  title={
                    <>
                      Entitlement
                      <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                        Set the entitlement options for this policy
                      </p>
                    </>
                  }
                >

                </ProCard>
              </ProForm.Group>
            )}
            {step.name === 'applicability' && (
              <ProForm.Group>
                <ProCard
                  title="Applicability"
                  bordered
                  headerBordered
                  style={{
                    marginBlockEnd: 16,
                    minWidth: '100%',
                    maxWidth: '100%',
                  }}
                >
                  <ProCard
                    title="Eligibility Criteria"
                    bordered
                    style={{ minHeight: 150 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <Text type="secondary">
                        Specify who is eligible for this leave policy
                      </Text>

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {criteriaApplicable.map((criterion, index) => (
                          <ProForm.Group
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              gap: '10px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: '10px',
                                flex: 1,
                              }}
                            >
                              <ProFormSelect
                                width="sm"
                                label={`Applicable To`}
                                name={`applicableTo-${index}`}
                                options={availableOptionsToApplicable}
                                fieldProps={{
                                  value: criterion,
                                  onChange: (value) =>
                                    handleCriteriaApplicableChange(
                                      value as string,
                                      index
                                    ),
                                }}
                                rules={[{ required: true }]}
                              />
                              <ProFormSelect
                                width="sm"
                                label={`Criteria`}
                                name={'applicableCriteria'}
                              />
                              <Button
                                type="link"
                                onClick={() =>
                                  handleDeleteCriteriaApplicable(index)
                                }
                                style={{
                                  padding: '0 8px',
                                  height: '60px',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <DeleteOutlined style={{ fontSize: '20px' }} />
                              </Button>
                            </div>
                          </ProForm.Group>
                        ))}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%',
                        }}
                      >
                        <Button
                          type="dashed"
                          onClick={handleAddCriteriaApplicable}
                          disabled={availableOptionsToApplicable.length === 0}
                        >
                          Add Criteria
                        </Button>
                      </div>
                    </div>
                  </ProCard>
                  <ProCard
                    title="Exceptions"
                    bordered
                    style={{ minHeight: 150 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {criteriaException.length === 0 ? (
                        <Text type="secondary">
                          No one has been ruled out from this leave policy. Do
                          you want to add any exceptions?
                        </Text>
                      ) : (
                        <Text type="secondary">
                          Specify who is not eligible for this leave policy
                        </Text>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {criteriaException.map((criterion, index) => (
                          <ProForm.Group
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              gap: '10px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: '10px',
                                flex: 1,
                              }}
                            >
                              <ProFormSelect
                                width="sm"
                                label={`Exception To`}
                                name={`exceptionTo-${index}`}
                                options={availableOptionsToException}
                                fieldProps={{
                                  value: criterion,
                                  onChange: (value) =>
                                    handleCriteriaExceptionChange(
                                      value as string,
                                      index
                                    ),
                                }}
                                rules={[{ required: true }]}
                              />
                              <ProFormSelect
                                width="sm"
                                label={`Criteria`}
                                name={'exceptionCriteria'}
                              />
                              <Button
                                type="link"
                                onClick={() =>
                                  handleDeleteCriteriaException(index)
                                }
                                style={{
                                  padding: '0 8px',
                                  height: '60px',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <DeleteOutlined style={{ fontSize: '20px' }} />
                              </Button>
                            </div>
                          </ProForm.Group>
                        ))}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%',
                        }}
                      >
                        <Button
                          type="dashed"
                          onClick={handleAddCriteriaException}
                          disabled={availableOptionsToException.length === 0}
                        >
                          Add Criteria
                        </Button>
                      </div>
                    </div>
                  </ProCard>
                </ProCard>
              </ProForm.Group>
            )}
            {step.name === 'restrictions' && (
              <ProForm.Group>
                <ProCard
                  title={
                    <>
                      Restrictions
                      <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                        Define how to manage leave policies and other restrictions.
                      </p>
                    </>
                  }
                  bordered
                  headerBordered
                  style={{
                    marginBlockEnd: 16,
                    width: '100%',
                  }}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12}>
                      <ProCard
                        title={
                          <>
                            Exceeded Leaves
                            <p
                              style={{
                                margin: 0,
                                fontSize: '12px',
                                color: '#888',
                              }}
                            >
                              Define how to manage leaves that exceed the set
                              entitlement
                            </p>
                          </>
                        }
                        bordered
                        headerBordered
                        className="h-full"
                      >
                        <ProForm.Group>
                          <ProFormCheckbox.Group
                            options={[
                              {
                                label:
                                  'Allow leave requests that exceed the entitled leaves',
                                value: 'allowExceed',
                              },
                            ]}
                            fieldProps={{
                              value: allowExceed,
                              onChange: handleAllowExceedChange,
                            }}
                          />
                        </ProForm.Group>
                        {allowExceed.includes('allowExceed') && (
                          <ProForm.Group>
                            <ProFormRadio.Group
                              name={'exceedLimitOption'}
                              options={[
                                {
                                  label: 'Without Limit',
                                  value: 'withoutLimit',
                                },
                                {
                                  label: 'Until Year End Limit',
                                  value: 'untilYearEnd',
                                },
                              ]}
                              fieldProps={{
                                value: exceedLimitOption,
                                onChange: handleExceedLimitChange,
                              }}
                            />
                          </ProForm.Group>
                        )}
                        {allowExceed.includes('allowExceed') &&
                          exceedLimitOption === 'withoutLimit' && (
                            <ProFormCheckbox.Group
                              name={'markAsLOP'}
                              fieldProps={{
                                onChange: handleMarkAsLOPChange,
                              }}
                              initialValue={markAsLOP}
                              options={[
                                {
                                  label: 'Mark excess as LOP',
                                  value: 'markAsLOP',
                                },
                              ]}
                            />
                          )}
                      </ProCard>
                    </Col>

                    <Col xs={24} sm={24} md={12}>
                      <ProCard
                        title={
                          <>
                            Sandwich Leave Policy
                            <p
                              style={{
                                margin: 0,
                                fontSize: '12px',
                                color: '#888',
                              }}
                            >
                              Define how to manage leaves that exceed the set
                              entitlement
                            </p>
                          </>
                        }
                        bordered
                        headerBordered
                        className="h-full"
                      >
                        <ProFormSwitch
                          label="Enable Sandwich Leave Policy"
                          name={'isSandwichPolicyEnabled'}
                          fieldProps={{
                            checked: isSandwichPolicyEnabled,
                            onChange: (checked) =>
                              setIsSandwichPolicyEnabled(checked),
                          }}
                          initialValue={isSandwichPolicyEnabled}
                        />
                        {isSandwichPolicyEnabled && (
                          <>
                            <ProFormCheckbox.Group
                              name={'considerWeekends'}
                              fieldProps={{
                                onChange: (values) =>
                                  setConsiderWeekends(
                                    values.includes('considerWeekends')
                                  ),
                              }}
                              initialValue={considerWeekends}
                              options={[
                                {
                                  label:
                                    'Consider weekends occurring between requested period as leave',
                                  value: 'considerWeekends',
                                },
                              ]}
                            />
                            {considerWeekends && (
                              <ProFormText
                                label="Count as leave after"
                                name={'countWeekendAfter'}
                                placeholder="e.g. 2"
                                fieldProps={{
                                  addonAfter: 'days',
                                }}
                                width={'xs'}
                              />
                            )}
                            <ProFormCheckbox.Group
                              name={'considerHolidays'}
                              fieldProps={{
                                onChange: (values) =>
                                  setConsiderHolidays(
                                    values.includes('considerHolidays')
                                  ),
                              }}
                              initialValue={considerHolidays}
                              options={[
                                {
                                  label:
                                    'Consider holidays occurring between requested period as leave',
                                  value: 'considerHolidays',
                                },
                              ]}
                            />
                            {considerHolidays && (
                              <ProFormText
                                label="Count as leave after"
                                name={'countHolidaysAfter'}
                                placeholder="e.g. 2"
                                fieldProps={{
                                  addonAfter: 'days',
                                }}
                                width={'xs'}
                              />
                            )}
                          </>
                        )}
                      </ProCard>
                    </Col>

                    <Col xs={24} sm={24} md={12}>
                      <ProCard
                        title={
                          <>
                            Clubbing Policy
                            <p
                              style={{
                                margin: 0,
                                fontSize: '12px',
                                color: '#888',
                              }}
                            >
                              The selected leave policies can't be taken
                              together with this policy
                            </p>
                          </>
                        }
                        bordered
                        headerBordered
                        className="h-full"
                      >
                        <ProFormSelect
                          label="The leave cannot be taken along with"
                          name="clubbingPolicy"
                          fieldProps={{
                            mode: 'multiple',
                          }}
                        />
                      </ProCard>
                    </Col>

                    <Col xs={24} sm={24} md={12}>
                      <ProCard
                        title={
                          <>
                            Reports
                            <p
                              style={{
                                margin: 0,
                                fontSize: '12px',
                                color: '#888',
                              }}
                            >
                              Define how report data is to be displayed
                            </p>
                          </>
                        }
                        bordered
                        headerBordered
                        className="h-full"
                      >
                        <ProForm.Group>
                          <ProFormSelect
                            width={'sm'}
                            label="Allow employees to view"
                            name={'reportData'}
                            options={[
                              {
                                label: 'Leave taken alone',
                                value: 'leaveTakenAlone',
                              },
                              {
                                label: 'Simple Leave Summary',
                                value: 'simpleLeaveSummary',
                              },
                              {
                                label: 'Complete Leave Summary',
                                value: 'completeLeaveSummary',
                              },
                            ]}
                          />
                          <ProFormSelect
                            width={'sm'}
                            label="Balance is to be displayed as"
                            name={'balanceDisplay'}
                            options={[
                              {
                                label: "Leave request's start date",
                                value: 'startDate',
                              },
                              {
                                label: 'Year and estimated balance',
                                value: 'yearBalance',
                              },
                              {
                                label: 'Accrual Period Balance',
                                value: 'accrualPeriodBalance',
                              },
                              {
                                label: 'Current data balance',
                                value: 'currentBalance',
                              },
                            ]}
                          />
                        </ProForm.Group>
                      </ProCard>
                    </Col>

                    <Col xs={24} sm={24} md={12}>
                      <ProCard
                        title={
                          <>
                            File Upload
                            <p
                              style={{
                                margin: 0,
                                fontSize: '12px',
                                color: '#888',
                              }}
                            >
                              Define if a supporting document is required to
                              apply for this leave policy
                            </p>
                          </>
                        }
                        bordered
                        headerBordered
                        className="h-full"
                      >
                        <ProFormCheckbox.Group
                          name='uploadDoc'
                          options={[
                            {
                              label:
                                'Upload supporting documents if the applied leave period exceeds',
                              value: 'uploadSupportingDocuments',
                            },
                          ]}
                          fieldProps={{
                            value: allowExceed,
                            onChange: handleAllowExceedChange,
                          }}
                        />
                        <ProFormText
                          width={'xs'}
                          placeholder="e.g. 2"
                          fieldProps={{
                            addonAfter: 'days',
                          }}
                          name={'uploadDocExceedLeaves'}
                        />
                      </ProCard>
                    </Col>

                    <Col xs={24} sm={24} md={12}>
                      <ProCard
                        title={
                          <>
                            Record level restrictions
                            <p
                              style={{
                                margin: 0,
                                fontSize: '12px',
                                color: '#888',
                              }}
                            >
                              Define settings related to leave restrictions
                            </p>
                          </>
                        }
                        bordered
                        headerBordered
                        className="h-full"
                      >
                        <ProForm submitter={false} layout="vertical">
                          <ProFormCheckbox.Group
                            name="allowedDurations"
                            label="Allowed durations for this leave policy are"
                            options={[
                              { label: 'Full Day',value: 'fullDay',disabled: true },
                              { label: 'Half Day', value: 'halfDay' },
                              { label: 'Quarter Day', value: 'quarterDay' },
                              { label: 'Hourly', value: 'hourly' },
                            ]}
                            initialValue={['fullDay']}
                          />

                          <ProFormCheckbox
                            name= "allowPastDays"
                            initialValue={allowPastDates}
                            fieldProps={{
                              onChange: (e) =>
                                setAllowPastDates(e.target.checked),
                            }}
                          >
                            Allow requests for Past dates
                          </ProFormCheckbox>
                          {allowPastDates && (
                            <ProFormText
                              name="pastDaysInput"
                              label="Past days"
                              width="xs"
                              placeholder="e.g. 2"
                              fieldProps={{
                                addonAfter: 'days',
                              }}
                            />
                          )}

                          <ProFormCheckbox
                            name="allowFutureDates"
                            initialValue={allowFutureDates}
                            fieldProps={{
                              onChange: (e) =>
                                setAllowFutureDates(e.target.checked),
                            }}
                          >
                            Allow requests for Future dates
                          </ProFormCheckbox>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              paddingLeft: '24px',
                            }}
                          >
                            {allowFutureDates && (
                              <>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                  }}
                                >
                                  <ProFormCheckbox
                                    name="enableNextDays"
                                    initialValue={enableNextDays}
                                    fieldProps={{
                                      onChange: handleCheckboxChange('enableNextDays'),
                                    }}
                                    style={{
                                      marginBottom: 0,
                                      minWidth: '120px',
                                    }}
                                  >
                                    Next
                                  </ProFormCheckbox>
                                  {/* {enableNextDays && ( */}
                                    <ProFormText
                                      name="nextDaysInput"
                                      width="xs"
                                      placeholder="e.g. 2"
                                      fieldProps={{
                                        addonAfter: 'days',
                                      }}
                                      style={{ marginBottom: 0 }}
                                      disabled={!checkboxState.enableNextDays}
                                    />
                                  {/* )} */}
                                </div>

                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                  }}
                                >
                                  <ProFormCheckbox
                                    name="enableAdvanceDays"
                                    initialValue={enableAdvanceDays}
                                    fieldProps={{
                                      onChange: handleCheckboxChange('enableAdvanceDays'),
                                    }}
                                    style={{
                                      marginBottom: 0,
                                      minWidth: '120px',
                                    }}
                                  >
                                    To be applied
                                  </ProFormCheckbox>
                                  {/* {enableAdvanceDays && ( */}
                                    <ProFormText
                                      name="advanceDaysInput"
                                      width="sm"
                                      placeholder="e.g. 2"
                                      fieldProps={{
                                        addonAfter: 'days in advance',
                                      }}
                                      style={{ marginBottom: 0 }}
                                      disabled={!checkboxState.enableAdvanceDays}
                                    />
                                  {/* )} */}
                                </div>
                              </>
                            )}
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                            }}
                          >
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <ProFormCheckbox
                                name="adminOnly"
                                style={{ marginRight: '8px' }}
                              >
                                Allow only administrators to view and apply this
                                leave on employee's behalf
                              </ProFormCheckbox>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Space.Compact>
                                <ProFormCheckbox
                                  name="minLeaveInput"
                                  style={{ marginRight: '8px' }}
                                  fieldProps={{
                                    onChange:
                                      handleCheckboxChange('minLeaveInput'),
                                  }}
                                >
                                  Minimum leave allowed per leave request
                                </ProFormCheckbox>
                                <ProFormText
                                  name="minLeaveValue"
                                  width="xs"
                                  placeholder="e.g. 2"
                                  style={{ marginBottom: 0, width: '100px' }}
                                  disabled={!checkboxState.minLeaveInput}
                                />
                              </Space.Compact>
                            </div>
                            {/* Maximum Leave */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Space.Compact>
                                <ProFormCheckbox
                                  name="maxLeaveInput"
                                  style={{ marginRight: '8px' }}
                                  fieldProps={{
                                    onChange:
                                      handleCheckboxChange('maxLeaveInput'),
                                  }}
                                >
                                  Maximum leave allowed per leave request
                                </ProFormCheckbox>
                                <ProFormText
                                  name="maxLeaveValue"
                                  width="xs"
                                  placeholder="e.g. 2"
                                  style={{ marginBottom: 0, width: '100px' }}
                                  disabled={!checkboxState.maxLeaveInput}
                                />
                              </Space.Compact>
                            </div>
                            {/* Maximum Consecutive Days */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Space.Compact>
                                <ProFormCheckbox
                                  name="maxConsecutiveDays"
                                  style={{ marginRight: '8px' }}
                                  fieldProps={{
                                    onChange:
                                      handleCheckboxChange(
                                        'maxConsecutiveDays'
                                      ),
                                  }}
                                >
                                  Maximum number of consecutive days of leave
                                  allowed
                                </ProFormCheckbox>
                                <ProFormText
                                  name="maxConsecutiveDaysValue"
                                  width="xs"
                                  placeholder="e.g. 2"
                                  style={{ marginBottom: 0, width: '100px' }}
                                  disabled={!checkboxState.maxConsecutiveDays}
                                />
                              </Space.Compact>
                            </div>
                            {/* Minimum Gap Between Leaves */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Space.Compact>
                                <ProFormCheckbox
                                  name="minGapBetweenLeaves"
                                  style={{ marginRight: '8px' }}
                                  fieldProps={{
                                    onChange: handleCheckboxChange(
                                      'minGapBetweenLeaves'
                                    ),
                                  }}
                                >
                                  Minimum gap (in days) between two leave
                                  requests
                                </ProFormCheckbox>
                                <ProFormText
                                  name="minGapBetweenLeavesValue"
                                  width="xs"
                                  placeholder="e.g. 2"
                                  style={{ marginBottom: 0, width: '100px' }}
                                  disabled={!checkboxState.minGapBetweenLeaves}
                                />
                              </Space.Compact>
                            </div>{' '}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <Text style={{ marginRight: '8px' }}>
                                Maximum number of requests allowed within the specified period
                              </Text>
                              <ProFormText
                                name="maxRequestsValue"
                                placeholder="e.g. 2"
                                width="xs"
                                style={{ width: '60px' }}
                              />
                              <ProFormSelect
                                name="requestPeriod"
                                placeholder="Select"
                                width="xs"
                                options={[
                                  { label: 'Week', value: 'week' },
                                  { label: 'Month', value: 'month' },
                                  { label: 'Year', value: 'year' },
                                  { label: 'Accrual Period', value: 'accrualPeriod' },
                                  { label: 'Job Tenure', value: 'jobTenure' },
                                ]}
                                style={{ width: '120px' }}
                              />
                            </div>
                            <div
                              style={{
                                marginTop: '16px',
                              }}
                            >
                              <ProFormSelect
                                name="leaveApplicationDays"
                                label="This leave can be applied only on"
                                placeholder="Select"
                                width="md"
                                mode="multiple"
                                options={[
                                  { label: 'Restricted Holidays', value: 'restrictedHolidays' },
                                  { label: 'Date of Birth', value: 'dateOfBirth' },
                                  { label: 'Date of Exit', value: 'dateOfExit' },
                                  { label: 'Date of Joining', value: 'dateOfJoining' }
                                ]}
                              />
                            </div>
                          </div>
                        </ProForm>
                      </ProCard>
                    </Col>
                  </Row>
                </ProCard>
              </ProForm.Group>
            )}
          </StepsForm.StepForm>
        ))}
      </StepsForm>
    </ProCard>
  );
};

export default LeavePolicyMainOld;
