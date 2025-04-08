import { CheckCard, PageContainer } from "@ant-design/pro-components";
import { PayrollComponentsSharedService, PayrollTypesSharedService } from "@hrexpert/shared-services";
import { Button, Col, Flex, Form, message, Row, Select } from "antd";
import { useEffect, useState } from "react";

export const PayrollTypeComponentsMapping = () => {
    const [payrollTypesData, setPayrollTypesData] = useState<any[]>([]);
    const [payrollComponentsData, setPayrollComponentsData] = useState<any[]>([]);
    const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
    const [selectedComponentIds, setSelectedComponentIds] = useState<any[]>([]);
    const [unSelectCheckCards, setUnSelectCheckCards] = useState<any[]>([]);
    const payrollTypeSharedService = new PayrollTypesSharedService();
    const payrollComponentsSharedService = new PayrollComponentsSharedService();
    const { Option } = Select;
    const [form] = Form.useForm();

    useEffect(() => {
        getPayrollTypes();
        getPayrollTypesComponents();
    }, []);

    const getPayrollTypes = () => {
        try {
            payrollTypeSharedService.getAllPayrollTypes().then((res) => {
                if (res.status) {
                    setPayrollTypesData(res.data);
                } else {
                    setPayrollTypesData([]);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const getPayrollTypesComponents = () => {
        try {
            payrollComponentsSharedService.getAllPayrollComponents().then((res) => {
                if (res.status) {
                    setPayrollComponentsData(res.data);
                } else {
                    setPayrollComponentsData([]);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const createPayrollTypesComponents = () => {
        if (!selectedTypeId || selectedComponentIds.length === 0) {
            message.warning("Please Select Component")
            return;
        }
        const req = selectedComponentIds.map((i) => ({
            payrollTypeId: selectedTypeId,
            payrollComponentId: i,
        }));
        payrollComponentsSharedService.createPayrollTypeComponents(req).then((res) => {
            if (res.status) {
                message.success("Data Saved SuccessFully")
                form.resetFields();
                setSelectedTypeId(null)
                setSelectedComponentIds([])
                form.getFieldValue(selectedTypeId)
            } else {
                message.error("Error");
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    const onReset = () => {
        // form.resetFields();
        setUnSelectCheckCards(selectedComponentIds);
        setSelectedComponentIds([]);
    }

    return (
        <>
            <PageContainer title='Payroll Type Components' breadcrumbRender={false}>
                <Form form={form}>
                    <Row gutter={24}>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 4 }}
                            lg={{ span: 4 }}
                            xl={{ span: 6 }}
                        >
                            <Form.Item name="Name" label="Payroll Type">
                                <Select
                                    showSearch
                                    placeholder="Select Payroll Type"
                                    optionFilterProp="children"
                                    allowClear
                                    onChange={(value) => setSelectedTypeId(value)}
                                    value={selectedTypeId}
                                >
                                    {payrollTypesData.map((type: any) => (
                                        <Option key={type.id} value={type.id}>
                                            {type.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {selectedTypeId && (
                        <Flex gap={24} vertical>
                            <CheckCard.Group
                                multiple
                                onChange={(values: string[]) => setSelectedComponentIds(values)}
                                value={selectedComponentIds}
                            >
                                {payrollComponentsData.map((c: any) => (
                                    <CheckCard
                                        key={c.id}
                                        // title={c.componentName}
                                        description={
                                            <>
                                                Component Name: {c.componentName}
                                                <br />
                                                Column Name: {c.columnName}
                                                <br />
                                                Round Strg: {c.roundStrg}
                                            </>
                                        }
                                        value={c.id}
                                    />
                                ))}
                            </CheckCard.Group>
                        </Flex>
                    )}

                    {selectedTypeId && (
                        <Row>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 6 }}>
                                <Button type="primary" onClick={createPayrollTypesComponents}>
                                    Submit
                                </Button>
                                &nbsp;&nbsp;
                                <Button type="primary" danger onClick={onReset}>
                                    Reset
                                </Button>
                            </Col>
                        </Row>
                    )}
                </Form>
            </PageContainer>
        </>
    );
};

export default PayrollTypeComponentsMapping;
