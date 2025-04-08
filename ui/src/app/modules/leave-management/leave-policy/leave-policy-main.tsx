// import {AccrualIntervalsDisplay,AccrualIntervalsEnum,CalendarReferenceDisplay,CalendarReferenceEnum,CalendarUnitDisplay,CalendarUnitEnum,LeaveTypeDisplay,LeaveTypeEnum,TimelineDatesDisplay,TimelineDatesEnum,} from '@hrexpert/shared-models';
// import {Button,Card,Checkbox,DatePicker,Form,Input,InputNumber,message,Radio,Select,Space,} from 'antd';

// const { TextArea } = Input;
// const { RangePicker } = DatePicker;

// const LeavePolicyMain = () => {
//   const onFinish = async (values: any) => {
//     console.log('Form submitted:', values);
//     message.success('Form submitted successfully!');
//   };

//   return (
//     <Card>
//     <Form 
//       layout="horizontal" 
//       onFinish={onFinish}
//       style={{ maxWidth: '100%' }}
//     >
//       <Card title="Leave Type" bordered style={{ marginBottom: 24 }}>
//         <Form.Item name="id" label="Id" hidden>
//           <Input />
//         </Form.Item>
//         <Space size="large" wrap>
//           <Form.Item
//             name="typeOfLeave"
//             label="Type of Leave"
//             rules={[{ required: true, message: 'Please Enter Type of Leave' }]}
//           >
//             <Input placeholder="Enter Type of Leave" style={{ width: 200 }} />
//           </Form.Item>

//           <Form.Item
//             name="leaveCode"
//             label="Leave Code"
//             rules={[{ required: true, message: 'Please Enter Leave Code' }]}
//           >
//             <Input placeholder="Enter Leave Code" style={{ width: 200 }} />
//           </Form.Item>

//           <Form.Item
//             name="type"
//             label="Type"
//             rules={[{ required: true, message: 'Please Select Type' }]}
//           >
//             <Select
//               placeholder="Select Type"
//               style={{ width: 200 }}
//               options={Object.values(LeaveTypeEnum).map((type) => ({
//                 label: LeaveTypeDisplay[type],
//                 value: type,
//               }))}
//             />
//           </Form.Item>

//           <Form.Item
//             name="unit"
//             label="Unit"
//             rules={[{ required: true, message: 'Please Select Unit' }]}
//             initialValue="days"
//           >
//             <Radio.Group buttonStyle="solid">
//               <Radio.Button value="days">Days</Radio.Button>
//               <Radio.Button value="hours">Hours</Radio.Button>
//             </Radio.Group>
//           </Form.Item>

//           <Form.Item
//             name="balanceBasedOn"
//             label="Balance Based On"
//             rules={[{ required: true, message: 'Please Select Balance Based On' }]}
//             initialValue="fixedEntitlement"
//           >
//             <Radio.Group buttonStyle="solid">
//               <Radio.Button value="fixedEntitlement">Fixed Entitlement</Radio.Button>
//               <Radio.Button value="leaveGrant">Leave Grant</Radio.Button>
//             </Radio.Group>
//           </Form.Item>

//           <Form.Item name="description" label="Description">
//             <TextArea placeholder="Enter Description" style={{ width: 200 }} />
//           </Form.Item>

//           <Form.Item name="validity" label="Validity">
//             <RangePicker />
//           </Form.Item>
//         </Space>
//       </Card>

//       <Card title="Configuration" bordered style={{ marginBottom: 24 }}>
//         <Space direction="vertical" size="large" style={{ width: '100%' }}>
//           <Space size="large" wrap>
//             <Form.Item
//               name="effectiveAfter"
//               label="Effective After"
//               rules={[
//                 { pattern: /^[0-9]*$/, message: 'Please enter numbers only' },
//                 { required: true, message: 'Please enter a value' },
//               ]}
//             >
//               <InputNumber
//                 placeholder="Enter Value"
//                 min={1}
//                 style={{ width: 100 }}
//                 keyboard={false}
//               />
//             </Form.Item>

//             <Form.Item
//               name="calendarUnit"
//               initialValue="fixedEntitlement"
//               rules={[{ required: true, message: 'Please Select Balance Based On' }]}
//             >
//               <Radio.Group buttonStyle="solid">
//                 {Object.values(CalendarUnitEnum).map((type) => (
//                   <Radio.Button key={type} value={type}>
//                     {CalendarUnitDisplay[type]}
//                   </Radio.Button>
//                 ))}
//               </Radio.Group>
//             </Form.Item>

//             <Form.Item name="from" label="From">
//               <Select
//                 style={{ width: 200 }}
//                 options={Object.values(TimelineDatesEnum).map((type) => ({
//                   label: TimelineDatesDisplay[type],
//                   value: type,
//                 }))}
//               />
//             </Form.Item>
//           </Space>

//           <Space size="large" wrap>
//             <Form.Item name="accrual" valuePropName="checked">
//               <Checkbox.Group options={['Accrual']} />
//             </Form.Item>

//             <Form.Item name="accrualInterval">
//               <Select
//                 style={{ width: 200 }}
//                 options={Object.values(AccrualIntervalsEnum).map((type) => ({
//                   label: AccrualIntervalsDisplay[type],
//                   value: type,
//                 }))}
//               />
//             </Form.Item>

//             <Form.Item name="accrualOn" label='On'>
//               <Select
//                 style={{ width: 200 }}
//                 options={Object.values(CalendarReferenceEnum).map((type) => ({
//                   label: CalendarReferenceDisplay[type],
//                   value: type,
//                 }))}
//               />
//             </Form.Item>

//             <Form.Item name="accrualValue">
//               <Select
//                 style={{ width: 200 }}
//                 options={Object.values(AccrualIntervalsEnum).map((type) => ({
//                   label: AccrualIntervalsDisplay[type],
//                   value: type,
//                 }))}
//               />
//             </Form.Item>

//             <Form.Item
//               name="noOfDays"
//               label="No. of Days"
//               rules={[
//                 { pattern: /^[0-9]*$/, message: 'Please enter numbers only' },
//                 { required: true, message: 'Please enter a value' },
//               ]}
//             >
//               <InputNumber
//                 placeholder="Enter Value"
//                 min={1}
//                 style={{ width: 100 }}
//                 keyboard={false}
//               />
//             </Form.Item>
//           </Space>

//           <Space size="large" wrap>
//             <Form.Item name="reset" valuePropName="checked">
//               <Checkbox.Group options={['Reset']} />
//             </Form.Item>

//             <Form.Item name="resetInterval">
//               <Select
//                 style={{ width: 200 }}
//                 options={Object.values(AccrualIntervalsEnum).map((type) => ({
//                   label: AccrualIntervalsDisplay[type],
//                   value: type,
//                 }))}
//               />
//             </Form.Item>

//             <Form.Item name="resetOn" label="On">
//               <Select
//                 style={{ width: 200 }}
//                 options={Object.values(CalendarReferenceEnum).map((type) => ({
//                   label: CalendarReferenceDisplay[type],
//                   value: type,
//                 }))}
//               />
//             </Form.Item>

//             <Form.Item name="resetValue">
//               <Select
//                 style={{ width: 200 }}
//                 options={Object.values(AccrualIntervalsEnum).map((type) => ({
//                   label: AccrualIntervalsDisplay[type],
//                   value: type,
//                 }))}
//               />
//             </Form.Item>
//           </Space>
//         </Space>
//       </Card>

//       <Card title="Applicable" bordered style={{ marginBottom: 24 }}>
//         <Space direction="vertical" size="large">
//           <Form.Item name="gender" label="Gender">
//             <Checkbox.Group
//               options={[
//                 { label: 'Male', value: 'male' },
//                 { label: 'Female', value: 'female' },
//                 { label: 'Others', value: 'others' },
//               ]}
//             />
//           </Form.Item>

//           <Form.Item name="maritalStatus" label="Marital Status">
//             <Checkbox.Group
//               options={[
//                 { label: 'Married', value: 'married' },
//                 { label: 'Unmarried', value: 'unmarried' },
//               ]}
//             />
//           </Form.Item>
//         </Space>
//       </Card>

//       <Card title="Restrictions" bordered style={{ marginBottom: 24 }}>
//         <Space direction="vertical" size="large" style={{ width: '100%' }}>
//           <Form.Item name="weekendsLeave" label="Weekends Between Leave Period">
//             <Radio.Group>
//               <Radio value="count">Count as leave</Radio>
//               <Radio value="dontCount">Don't count as leave</Radio>
//             </Radio.Group>
//           </Form.Item>

//           <Form.Item
//             noStyle
//             shouldUpdate={(prevValues, currentValues) =>
//               prevValues.weekendsLeave !== currentValues.weekendsLeave
//             }
//           >
//             {({ getFieldValue }) =>
//               getFieldValue('weekendsLeave') === 'count' ? (
//                 <Form.Item
//                   name="weekendsCountAfterDays"
//                   label="Count after days"
//                 >
//                   <InputNumber min={1} placeholder="Enter days" style={{ width: 100 }} />
//                 </Form.Item>
//               ) : null
//             }
//           </Form.Item>

//           <Form.Item name="holidaysLeave" label="Holidays Between Leave Period">
//             <Radio.Group>
//               <Radio value="count">Count as leave</Radio>
//               <Radio value="dontCount">Don't count as leave</Radio>
//             </Radio.Group>
//           </Form.Item>

//           <Form.Item
//             noStyle
//             shouldUpdate={(prevValues, currentValues) =>
//               prevValues.holidaysLeave !== currentValues.holidaysLeave
//             }
//           >
//             {({ getFieldValue }) =>
//               getFieldValue('holidaysLeave') === 'count' ? (
//                 <Form.Item
//                   name="holidaysCountAfterDays"
//                   label="Count after days"
//                 >
//                   <InputNumber min={1} placeholder="Enter days" style={{ width: 100 }} />
//                 </Form.Item>
//               ) : null
//             }
//           </Form.Item>

//           <Form.Item
//             name="exceedLeaveBalance"
//             label="While Applying Leave, Exceed Leave Balance"
//           >
//             <Radio.Group>
//               <Radio value="allow">Allow</Radio>
//               <Radio value="dontAllow">Don't Allow</Radio>
//             </Radio.Group>
//           </Form.Item>

//           <Form.Item
//             noStyle
//             shouldUpdate={(prevValues, currentValues) =>
//               prevValues.exceedLeaveBalance !== currentValues.exceedLeaveBalance
//             }
//           >
//             {({ getFieldValue }) =>
//               getFieldValue('exceedLeaveBalance') === 'allow' ? (
//                 <Form.Item name="exceedLeaveBalanceLimit">
//                   <Radio.Group>
//                     <Radio value="withoutLimit">Without limit</Radio>
//                     <Radio value="yearEndLimit">Until year end limit</Radio>
//                     <Radio value="lop">Without limit and mark as LOP</Radio>
//                   </Radio.Group>
//                 </Form.Item>
//               ) : null
//             }
//           </Form.Item>

//           <Form.Item name="restrictionStartDate" label="Restriction Start Date">
//             <DatePicker />
//           </Form.Item>

//           <Form.Item name="restrictionDetails" label="Restriction Details">
//             <TextArea placeholder="Enter Restrictions" />
//           </Form.Item>
//         </Space>
//       </Card>

//       <Card title="Advanced Settings" bordered style={{ marginBottom: 24 }}>
//         <Space direction="vertical" size="large" style={{ width: '100%' }}>
//           <Space>
//             <Form.Item name="minLeaveEnabled" valuePropName="checked">
//               <Checkbox>
//                 Minimum leave that can be availed per application
//               </Checkbox>
//             </Form.Item>
//             <Form.Item name="minLeave">
//               <Input placeholder="Enter value" style={{ width: 100 }} />
//             </Form.Item>
//           </Space>

//           <Space>
//             <Form.Item name="maxLeaveEnabled" valuePropName="checked">
//               <Checkbox>
//                 Maximum leave that can be availed per application
//               </Checkbox>
//             </Form.Item>
//             <Form.Item name="maxLeave">
//               <Input placeholder="Enter value" style={{ width: 100 }} />
//             </Form.Item>
//           </Space>

//           <Space>
//             <Form.Item name="maxConsecutiveDaysEnabled" valuePropName="checked">
//               <Checkbox>
//                 Maximum number of consecutive days of Leave allowed
//               </Checkbox>
//             </Form.Item>
//             <Form.Item name="maxConsecutiveDays">
//               <Input placeholder="Enter value" style={{ width: 100 }} />
//             </Form.Item>
//           </Space>

//           <Space>
//             <Form.Item name="minGapEnabled" valuePropName="checked">
//               <Checkbox>
//                 Minimum gap (in days) between two applications
//               </Checkbox>
//             </Form.Item>
//             <Form.Item name="minGap">
//               <Input placeholder="Enter value" style={{ width: 100 }} />
//             </Form.Item>
//           </Space>

//           <Space>
//             <Form.Item name="enableFileUpload" valuePropName="checked">
//               <Checkbox>
//                 Enable file upload option if the applied leave period exceeds
//               </Checkbox>
//             </Form.Item>
//             <Form.Item name="fileUploadDays">
//               <Input placeholder="Enter number of days" style={{ width: 100 }} />
//             </Form.Item>
//           </Space>

//           <Form.Item
//             name="maxApplications"
//             label="Maximum number of applications allowed within the specified period"
//           >
//             <Input placeholder="Enter value" style={{ width: 200 }} />
//           </Form.Item>

//           <Form.Item name="applicationPeriod">
//             <Select
//               style={{ width: 200 }}
//               placeholder="Select period"
//               options={[
//                 { label: 'Day', value: 'day' },
//                 { label: 'Week', value: 'week' },
//                 { label: 'Month', value: 'month' },
//               ]}
//             />
//           </Form.Item>
//         </Space>
//       </Card>

//       <Form.Item>
//         <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </Form.Item>
//         </div>
//       </Form.Item>
//     </Form>

//     </Card>
//   );
// };

// export default LeavePolicyMain;