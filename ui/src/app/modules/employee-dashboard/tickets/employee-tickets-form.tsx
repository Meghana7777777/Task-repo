import { ProCard, ProForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { AlertMessages, TicketsCategoryEnum } from '@hrexpert/shared-models';
import { EmployeeTicketsService } from '@hrexpert/shared-services';
import { Button, Form } from 'antd';

const EmployeeTicketsForm = ({ onViewTicket }) => {
    const [form] = Form.useForm();
    const employeeTicketsService = new EmployeeTicketsService()
    const data =  JSON.parse(localStorage.getItem('currentUser'))

    const submit = (values) => {
        console.log(values)
        try {
            employeeTicketsService.createTicket(values).then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage)
                    form.resetFields()
                } else {
                    console.log("Failed to post Data");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <ProCard
                title="Raise a Ticket"
                extra={<Button key='2' type='default' onClick={onViewTicket}>View Tickets</Button>}
            >
                <ProForm
                    form={form}
                    onFinish={async (values) => {
                        await submit(values);
                    }}
                >
                    <ProFormText
                        hidden
                        width="md"
                        name="employeeId"
                        label="employeeId"
                        initialValue={data.user.employeeId}
                        rules={[{ required: true }]}
                    />
                    <ProForm.Item noStyle shouldUpdate>
                        {(formInstance) => {
                            return (
                                <ProFormSelect
                                    options={Object.values(TicketsCategoryEnum).map((value) => ({
                                        value: value,
                                        label: value,
                                    }))}
                                    width="md"
                                    name="category"
                                    label={'Category'}
                                    placeholder="Select Category"
                                    rules={[{ required: true, message: 'Please Enter Amount!' }]}
                                />
                            );
                        }}
                    </ProForm.Item>
                    <ProFormText
                        width="md"
                        name="subject"
                        label="Subject"
                        placeholder="Enter Subject"
                        rules={[{ required: true, message: 'Please Enter Amount!' }]}
                    />
                    <ProFormTextArea width="md" label="Describe your issue" name="issue" rules={[{ required: true, message: 'Please Enter Amount!' }]} />
                </ProForm>
            </ProCard>
        </>
    )
}

export default EmployeeTicketsForm