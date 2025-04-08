import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  AccrualOnDisplay,
  AccrualOnEnum,
  AccrualPeriodDisplay,
  AccrualPeriodEnum,
  CreditTypeEnum,
  EffectiveFromDisplay,
  EffectiveFromEnum,
  EffectiveFromUomEnum,
  LeaveTypeDisplay,
  LeaveTypeEnum,
  UOMEnum,
  YesNoEnum
} from '@hrexpert/shared-models';
import { LeavePolicyService } from '@hrexpert/shared-services';
import { Button, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
interface LeavePolicyMainProps {
  leavePolicyData?: Partial<any>;
  isUpdate?: boolean;
  updateDetails: (style: any) => void;
  closeForm: () => void;
}
const LeavePolicyMain = (props: LeavePolicyMainProps) => {
  const [form] = useForm();
  const location = useLocation();
  const { policyType } = location.state || {};
  const navigate = useNavigate();
  const leavePolicyService = new LeavePolicyService();



 
  useEffect(() => {
    if (props.leavePolicyData) {
      const entitlements = props?.leavePolicyData?.entitlements?.[0] || {};
      form.setFieldsValue({
        ...props.leavePolicyData,
        validFrom: props?.leavePolicyData?.validFrom
          ? dayjs(props?.leavePolicyData?.validFrom, 'YYYY-MM-DD')
          : null,
        validTo: props?.leavePolicyData?.validTo
          ? dayjs(props?.leavePolicyData?.validTo, 'YYYY-MM-DD')
          : null,
        isProrate: entitlements?.isProrate === 1, // Map 1 to true, 0 to false
        isEncashment: entitlements?.isEncashment === 1,
        isCarryForward: entitlements?.isCarryForward === 1,
      });
    }
  }, [props.leavePolicyData, form]);
  

  const createLeavePolicy = (values) => {
    leavePolicyService
      .createLeavePolicy(values)
      .then((res) => {
        if (res.status) {
          message.success(res.internalMessage, 2);
          navigate('/leave-policy');
          props.closeForm()

        } else {
          message.error(res.internalMessage, 2);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };


  const backToView = () => {
    navigate('/leave-policy');
  };

  const onFinish = (values: any) => {
    if (props.isUpdate) {
      props.updateDetails({ ...values, id: props.leavePolicyData?.id });
    }
    else {
      createLeavePolicy(values)
    }

  };

  const monthToNumber = {
    JANUARY: '1',
    FEBRUARY: '2',
    MARCH: '3',
    APRIL: '4',
    MAY: '5',
    JUNE: '6',
    JULY: '7',
    AUGUST: '8',
    SEPTEMBER: '9',
    OCTOBER: '10',
    NOVEMBER: '11',
    DECEMBER: '12',
    POLICY_MONTH: 'POLICY_MONTH',
    JOINING_MONTH: 'JOINING_MONTH',
    BIRTH_MONTH: 'BIRTH_MONTH'
  };

  const getHalfYearlyPairs = () => ({
    JANUARY: ['1,7', 'January & July'],
    FEBRUARY: ['2,8', 'February & August'],
    MARCH: ['3,9', 'March & September'],
    APRIL: ['4,10', 'April & October'],
    MAY: ['5,11', 'May & November'],
    JUNE: ['6,12', 'June & December']
  });

  const getQuarterlyGroups = () => ({
    JANUARY: ['1,4,7,10', 'January, April, July, October'],
    FEBRUARY: ['2,5,8,11', 'February, May, August, November'],
    MARCH: ['3,6,9,12', 'March, June, September, December']
  });

  const getTriannualGroups = () => ({
    JANUARY: ['1,5,9', 'January, May, September'],
    FEBRUARY: ['2,6,10', 'February, June, October'],
    MARCH: ['3,7,11', 'March, July, November'],
    APRIL: ['4,8,12', 'April, August, December']
  });

  const [resetOptions, setResetOptions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState<AccrualPeriodEnum | null>(null);
  const [resetPeriod, setResetPeriod] = useState<AccrualPeriodEnum | null>(null);
  const [accrualOptions, setAccrualOptions] = useState([]);

  const getFilteredAccrualOptions = (period) => {
    switch (period) {
      case AccrualPeriodEnum.HALF_YEARLY:
        return Object.entries(getHalfYearlyPairs()).map(([month, [value, label]]) => ({
          label: label,
          value: value
        }));

      case AccrualPeriodEnum.QUARTERLY:
        return Object.entries(getQuarterlyGroups()).map(([month, [value, label]]) => ({
          label: label,
          value: value
        }));

      case AccrualPeriodEnum.TRIANNUALLY:
        return Object.entries(getTriannualGroups()).map(([month, [value, label]]) => ({
          label: label,
          value: value
        }));

      case AccrualPeriodEnum.MONTHLY:
        return Object.entries(AccrualOnEnum)
          .filter(([key]) => !['POLICY_MONTH', 'JOINING_MONTH', 'BIRTH_MONTH'].includes(key))
          .map(([key]) => ({
            label: key,
            value: monthToNumber[key]
          }));

      case AccrualPeriodEnum.ONE_TIME:
      case AccrualPeriodEnum.YEARLY:
        return Object.entries(AccrualOnEnum).map(([key]) => ({
          label: key.replace(/_/g, ' '),
          value: monthToNumber[key]
        }));

      default:
        return Object.entries(AccrualOnEnum).map(([key]) => ({
          label: key.replace(/_/g, ' '),
          value: monthToNumber[key]
        }));
    }
  };

  return (
    <ProCard
      title={'Leave Type'}
      headerBordered
      bordered
      extra={
        // <Button
        //   type="primary"
        //   onClick={backToView}
        // >
        //   View
        // </Button>
        !props.isUpdate && (
          <Button type="primary" onClick={backToView}>
            View
          </Button>
        )
      }
    >
      <ProForm
        layout="vertical"
        submitter={{
          render: (_, dom) => (
            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
                gap: '8px',
              }}
            >
              {dom}
            </div>
          ),
        }}
        onFinish={onFinish}
        initialValues={props.leavePolicyData}
      >
        <ProFormText name="id" label="Id" hidden />
        <ProFormGroup>
          <ProFormText name="leaveName" label="Name" rules={[{ required: true, message: 'Please Enter Type of Leave' }]} placeholder="Enter Type of Leave" width={'sm'} />
          <ProFormText label="Code" name="leaveCode" rules={[{ required: true, message: 'Please Enter Leave Code' }]} placeholder="Enter Leave Code" width={'sm'} />
          <ProFormSelect label="Type" name="leaveType" rules={[{ required: true, message: 'Please Select Type' }]} placeholder="Select Type" width={'sm'}
            options={Object.values(LeaveTypeEnum).map((type) => ({
              label: LeaveTypeDisplay[type],
              value: type,
            }))}
          />
          <ProFormRadio.Group
            name="overTime"
            label="Over Time"
            radioType="button"
            rules={[{ required: true, message: 'Please Select' }]}
            fieldProps={{ buttonStyle: 'solid' }}
            initialValue={YesNoEnum.NO}
            width="sm"
            options={Object.entries(YesNoEnum).map(([key, value]) => ({
              label: value,
              value: key,
            }))}
          />
          <ProFormRadio.Group name="uom" label="UOM" radioType="button" rules={[{ required: true, message: 'Please Select Unit' }]} fieldProps={{ buttonStyle: 'solid', }} initialValue={UOMEnum.DAYS} width={'sm'}
            options={Object.values(UOMEnum).map((type) => ({
              label: UOMEnum[type],
              value: type,
            }))}
          />
          <ProFormDatePicker name="validFrom" label="Valid From" rules={[{ required: true, message: 'Please Select Date' }]} />
          <ProFormDatePicker name="validTo" label="Valid To" />
          <ProFormText name="maxLimit" label="Apply Max Limit" rules={[{ required: true, message: 'Please Enter Number' }, { pattern: /^\d+(\.\d{1,2})?$/, message: 'Only numbers are allowed' }]} placeholder="Enter Maximum Limit" width={'sm'} />
          <ProFormText name="minLimit" label="Apply Min Limit" rules={[{ required: true, message: 'Please Enter Number' }, { pattern: /^\d+(\.\d{1,2})?$/, message: 'Only numbers are allowed' }]} placeholder="Enter Manimum Limit" width={'sm'} />
          <ProFormSelect
            name="cutOffDate"
            label="Cut Off Date"
            showSearch
            rules={[
              {
                required: true,
                message: 'Please select an cut of date',
              },
            ]}
            width="sm"
            options={[
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
              { label: '4', value: '4' },
              { label: '5', value: '5' },
              { label: '6', value: '6' },
              { label: '7', value: '7' },
              { label: '8', value: '8' },
              { label: '9', value: '9' },
              { label: '10', value: '10' },
              { label: '11', value: '11' },
              { label: '12', value: '12' },
              { label: '13', value: '13' },
              { label: '14', value: '14' },
              { label: '15', value: '15' },
              { label: '16', value: '16' },
              { label: '17', value: '17' },
              { label: '18', value: '18' },
              { label: '19', value: '19' },
              { label: '20', value: '20' },
              { label: '21', value: '21' },
              { label: '22', value: '22' },
              { label: '23', value: '23' },
              { label: '24', value: '24' },
              { label: '25', value: '25' },
              { label: '26', value: '26' },
              { label: '27', value: '27' },
              { label: '28', value: '28' },
              { label: '29', value: '29' },
              { label: '30', value: '30' },
              { label: '31', value: '31' },
            ]}
          />
          <ProFormSelect
            name="creditType"
            label="Credit Type"
            rules={[
              {
                required: false,
                message: 'Please enter CreditType',
              },
            ]}
            width={'sm'}
            options={Object.entries(CreditTypeEnum).map(
              ([key, value]) => ({
                label: key,
                value: value,
              })
            )}
          />
          <ProFormTextArea name="description" label="Description" placeholder="Enter Description" width={'sm'} />
        </ProFormGroup>
        <ProFormList name="entitlements"
          creatorButtonProps={{ creatorButtonText: 'Add Accrual Setting', icon: <PlusOutlined />, }}
          deleteIconProps={{ Icon: MinusCircleOutlined, }}
          copyIconProps={false}
          initialValue={[{}]}
        >
          {(f, index, action) => {
            return (
              <ProCard
                title={`Accrual Setting ${index + 1}`}
                bordered
                style={{ marginBottom: 16 }}
                collapsible
                headerBordered
              >
                <ProFormGroup>
                  <ProFormDigit
                    name="effectiveFromCount"
                    label="Effective Days"
                    rules={[{ required: true, message: 'Please enter' }]}
                    min={0}
                    width={'sm'}
                  />
                  <ProFormSelect
                    name="effectiveFromUom"
                    label="Effective UOM"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter accrual leaves',
                      },
                    ]}
                    width={'sm'}
                    options={Object.entries(EffectiveFromUomEnum).map(
                      ([key, value]) => ({
                        label: key,
                        value: value,
                      })
                    )}
                  />
                  <ProFormSelect
                    name="effectiveFrom"
                    label="Effective From"
                    rules={[{ required: true, message: 'Please Select' }]}
                    width={'sm'}
                    options={Object.entries(EffectiveFromEnum).map(
                      ([key, value]) => ({
                        label: EffectiveFromDisplay[key],
                        value: value,
                      })
                    )}
                  />
                  <ProFormRadio.Group
                    name="isProrate"
                    label="Prorate"
                    options={[
                      { label: 'Yes', value: 1 },
                      { label: 'No', value: 0 },
                    ]}
                    rules={[
                      {
                        required: true,
                        message: 'Please select prorata option',
                      },
                    ]}
                    width={'sm'}
                  />

                  <ProFormDigit
                    name="accrualLeaves"
                    label="Accrual Leaves"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter accrual leaves',
                      },
                    ]}
                    min={0}
                    width={'sm'}
                  />

                  <ProFormSelect
                    name="accrualPeriod"
                    label="Accrual Period"
                    options={Object.entries(AccrualPeriodEnum).map(([key, value]) => ({
                      label: key.replace(/_/g, ' '),
                      value: value
                    }))}
                    rules={[{ required: true, message: 'Please select accrual period' }]}
                    width={'sm'}
                    onChange={(value: AccrualPeriodEnum) => {
                      setSelectedPeriod(value);
                      setAccrualOptions(getFilteredAccrualOptions(value));
                    }}
                  />

                  <ProFormSelect
                    name="accrualOnDate"
                    label="Accrual On Date"
                    rules={[
                      {
                        required: true,
                        message: 'Please select an accrual date',
                      },
                    ]}
                    width="sm"
                    options={[
                      { label: '1', value: '1' },
                      { label: '2', value: '2' },
                      { label: '3', value: '3' },
                      { label: '4', value: '4' },
                      { label: '5', value: '5' },
                      { label: '6', value: '6' },
                      { label: '7', value: '7' },
                      { label: '8', value: '8' },
                      { label: '9', value: '9' },
                      { label: '10', value: '10' },
                      { label: '11', value: '11' },
                      { label: '12', value: '12' },
                      { label: '13', value: '13' },
                      { label: '14', value: '14' },
                      { label: '15', value: '15' },
                      { label: '16', value: '16' },
                      { label: '17', value: '17' },
                      { label: '18', value: '18' },
                      { label: '19', value: '19' },
                      { label: '20', value: '20' },
                      { label: '21', value: '21' },
                      { label: '22', value: '22' },
                      { label: '23', value: '23' },
                      { label: '24', value: '24' },
                      { label: '25', value: '25' },
                      { label: '26', value: '26' },
                      { label: '27', value: '27' },
                      { label: '28', value: '28' },
                      { label: '29', value: '29' },
                      { label: '30', value: '30' },
                      { label: '31', value: '31' },
                    ]}
                  />

                  {selectedPeriod !== AccrualPeriodEnum.MONTHLY && (
                    <ProFormSelect
                      name="accrualOn"
                      label="Accrual On"
                      options={accrualOptions}
                      rules={[{ required: true, message: 'Please select accrual on' }]}
                      width="sm"
                    />
                  )}

                  <ProFormSelect
                    name="resetPeriod"
                    label="Reset Period"
                    options={Object.entries(AccrualPeriodEnum).map(([key, value]) => ({
                      label: key.replace(/_/g, ' '),
                      value: value
                    }))}
                    onChange={(value: AccrualPeriodEnum) => {
                      setResetPeriod(value);
                      setResetOptions(getFilteredAccrualOptions(value));
                    }}
                    rules={[
                      { required: true, message: 'Please select reset period' },
                    ]}
                    width={'sm'}
                  />

                  <ProFormSelect
                    name="resetOnDate"
                    label="Reset On Date"
                    rules={[
                      {
                        required: true,
                        message: 'Please select an reset date',
                      },
                    ]}
                    width="sm"
                    options={[
                      { label: '1', value: '1' },
                      { label: '2', value: '2' },
                      { label: '3', value: '3' },
                      { label: '4', value: '4' },
                      { label: '5', value: '5' },
                      { label: '6', value: '6' },
                      { label: '7', value: '7' },
                      { label: '8', value: '8' },
                      { label: '9', value: '9' },
                      { label: '10', value: '10' },
                      { label: '11', value: '11' },
                      { label: '12', value: '12' },
                      { label: '13', value: '13' },
                      { label: '14', value: '14' },
                      { label: '15', value: '15' },
                      { label: '16', value: '16' },
                      { label: '17', value: '17' },
                      { label: '18', value: '18' },
                      { label: '19', value: '19' },
                      { label: '20', value: '20' },
                      { label: '21', value: '21' },
                      { label: '22', value: '22' },
                      { label: '23', value: '23' },
                      { label: '24', value: '24' },
                      { label: '25', value: '25' },
                      { label: '26', value: '26' },
                      { label: '27', value: '27' },
                      { label: '28', value: '28' },
                      { label: '29', value: '29' },
                      { label: '30', value: '30' },
                      { label: '31', value: '31' },
                    ]}
                  />

                  {resetPeriod !== AccrualPeriodEnum.MONTHLY && (
                    <ProFormSelect
                      name="resetOn"
                      label="Reset On"
                      options={resetOptions}
                      rules={[
                        { required: true, message: 'Please select reset on' },
                      ]}
                      width={'sm'}
                    />
                  )}
                  <ProFormRadio.Group
                    name="isCarryForward"
                    label="Carry Forward"
                    options={[
                      { label: 'Yes', value: 1 },
                      { label: 'No', value: 0 },
                    ]}
                    rules={[
                      {
                        required: true,
                        message: 'Please select carry forward option',
                      },
                    ]}
                    width={'sm'}
                  />

                  <ProFormDependency name={['isCarryForward']}>
                    {({ isCarryForward }) =>
                      isCarryForward && (
                        <ProFormDigit
                          name="carryForwardLimit"
                          label="Carry Forward Days"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter carry forward days',
                            },
                          ]}
                          min={0}
                          width={'sm'}
                        />
                      )
                    }
                  </ProFormDependency>

                  <ProFormRadio.Group
                    name="isEncashment"
                    label="Encashment"
                    options={[
                      { label: 'Yes', value: 1 },
                      { label: 'No', value: 0 },
                    ]}
                    rules={[
                      {
                        required: true,
                        message: 'Please select encashment option',
                      },
                    ]}
                    width={'sm'}
                  />

                  <ProFormDependency name={['isEncashment']}>
                    {({ isEncashment }) =>
                      isEncashment && (
                        <ProFormDigit
                          name="encashmentLimit"
                          label="Encashment Days"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter encashment days',
                            },
                          ]}
                          min={0}
                          width={'sm'}
                        />
                      )
                    }
                  </ProFormDependency>
                </ProFormGroup>
              </ProCard>
            );
          }}
        </ProFormList>
      </ProForm>
    </ProCard>
  );
};

export default LeavePolicyMain;
