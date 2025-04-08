import { UndoOutlined } from "@ant-design/icons";
import { BranchesDto } from '@hrexpert/shared-models';
import { BranchesService } from '@hrexpert/shared-services';
import { Button, Card, Checkbox, Col, Form, Input, Row, Select, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Props {
    branchData?: BranchesDto;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    branchForm?: FormInstance<any>;
    getAllBranches: () => void
    companyRecords?: any
}

const BranchForm = (props: Props) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [disable, setDisable] = useState<boolean>(false);
    let navigate = useNavigate();
    const branchService = new BranchesService();
    // const compData = props.companyRecords.map((t) => t.companyName)
    useEffect(() => {
        if (props.branchData) {
            form.setFieldsValue(props.branchData);
        }
    }, [props.branchData, form]);

    // useEffect(() => {
    //     if (props.isUpdate) {
    //         form.setFieldsValue({ companyName: compData });
    //     }
    // }, [props.isUpdate, form]);


    const onReset = () => {
        form.resetFields();
    };

    const createBranch = async (val: BranchesDto) => {
        try {
            branchService.createBranch(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    props.closeForm()
                    props.getAllBranches()
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
        if (props.isUpdate) {
            props.updateDetails({ ...val, id: props.branchData?.id, companyId: val.companyId });
        }
        else {
            createBranch(val)
        }
    }

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];



    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.branchData}>
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="branchName"
                            label="Branch Name"
                            rules={[{ required: true, message: "Please Enter Branch Name" }]}
                        >
                            <Input
                                placeholder="Enter Branch Name"
                                disabled={props.isUpdate} // Disable the field if isUpdate is true
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="branchCode"
                            label="Branch Code"
                        //  rules={[{ required: true, message: "Please Enter Branch Code" }]}
                        >
                            <Input placeholder="Enter Branch Code" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            label="State"
                            name="state"
                            rules={[{ required: true, message: "Please select a State" }]}
                        >
                            <Select placeholder="Select State" allowClear dropdownMatchSelectWidth={false}>
                                {indianStates.map((state) => (
                                    <Select.Option key={state} value={state}>
                                        {state}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: "Please Enter Address" }]}
                        >
                            <Input placeholder="Enter Address" allowClear />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label='Company' name='companyId' 
                            rules={[{ required: true, message: "Please Select Company" }]}
                        >
                            <Select
                                showSearch
                                placeholder='Select Company'
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.children ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                } >
                                {props?.companyRecords.map((comp) => (
                                    <Option key={comp.id} value={comp.id}>
                                        {comp.companyName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            label="Unit Name"
                            name="unitName"
                        // rules={[{ required: true, message: "Please Enter Unit Name" }]}
                        >
                            <Input placeholder="Enter Unit Name" allowClear />
                        </Form.Item>
                    </Col>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Item name="isEmployee" valuePropName="checked">
                        <Checkbox style={{ marginTop: "23px" }} onChange={(e) => form.setFieldValue('isEmployee', e.target.checked ? 1 : 0)}>
                            Employee
                        </Checkbox>
                    </Form.Item>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Item name="isWorker" valuePropName="checked">
                        <Checkbox style={{ marginTop: "23px" }} onChange={(e) => form.setFieldValue('isWorker', e.target.checked ? 1 : 0)}>
                            Worker
                        </Checkbox>
                    </Form.Item>

                    {/* <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            label="PT Applicable"
                            name="ptApplicable"
                          //  rules={[{ required: true, message: "Please Enter Address" }]}
                        >
                            <Select placeholder="Select PT Applicable">
                                <Option value="YES">YES</Option>
                                <Option value="NO">NO</Option>
                            </Select>
                        </Form.Item>
                    </Col> */}
                </Row>
                <Row>
                    {/* <Col xs={24} sm={12} md={8} lg={6} xl={2}> */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="ant-submit-btn"
                            style={{ marginTop: 23 }}
                            disabled={disable}
                        >
                            {props.isUpdate ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                    {/* </Col> */}
                    {/* <Col xs={24} sm={12} md={8} lg={6} xl={2}> */}
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
                    {/* </Col> */}
                </Row>
            </Form>
        </Card>
    );
};

export default BranchForm;
