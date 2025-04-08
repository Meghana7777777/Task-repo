import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { IdProofService, RelationsService } from '@hrexpert/shared-services';
import { Button, Col, Form, FormInstance, Input, message, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
const { Option } = Select
export interface EmployeeFamilyDetailsFormProps {
    form: FormInstance<any>
    isUpdateFamilyDetails?: boolean
    rejoinStateChange?:boolean
}
export default function EmployeeFamilyDetailsForm(props: EmployeeFamilyDetailsFormProps) {

    const { form } = props
    const [relations, setRelations] = useState<any[]>([])
    const relationsService = new RelationsService()
    const [idProofs, setIdProofs] = useState([])
    const idProofService = new IdProofService()
    const [idProofName, setIdProofsName] = useState<number>()
    const [selectedRelation, setSelectedRelation] = useState<any>([])

    useEffect(() => {
        getRelations()
        getIdProofs()
    }, [])

    const getIdProofs = () => {
        idProofService.getActiveIdProofs().then((idProofs) => {
            if (idProofs.status) {
                setIdProofs(idProofs.data)
            }
        })
    }

    const getRelations = () => {
        relationsService.getActiveRelations().then((res) => {
            if (res.status) {
                setRelations(res.data)
            }
        })
    }
    useEffect(() => {
        const values = form.getFieldValue("employeeFamilyDetails");
        if (!values || values.length === 0) {
            form.setFieldsValue({ employeeFamilyDetails: [{}] });
        }
    }, []);

    const validateIDNumber = (_, value) => {
        const id = idProofs.find((rec) => rec.id === idProofName);
        if (id && id.regex) {
            const regex = new RegExp(id.regex.slice(1, -1))
            if (value && !regex.test(value)) {
                return Promise.reject(`Please Enter Valid ${id.name} Number`);
            }
        }
        return Promise.resolve();
    };

    const relationDuplicateValidate = (val: any, name: any) => {
        if (selectedRelation.includes(val)) {
            message.error('Relation Already selected')
            const fields = form.getFieldValue('employeeFamilyDetails');
            fields[name].relation = null
            form.setFieldsValue({ employeeFamilyDetails: fields });
        } else {
            setSelectedRelation([...selectedRelation, val]);
        }
    };

    const removeSelectedRelationType = (name: number) => {
        const fields = form.getFieldValue('employeeFamilyDetails');
        if (!fields || !fields[name] || !fields[name].relation) {
            console.error("Invalid field data");
            return;
        }
        const updatedSelectedEdu = selectedRelation.filter(
            (item) => item === fields[name].relation
        );
        setSelectedRelation(updatedSelectedEdu)
    };


    return (
        <>
            <Form.List name="employeeFamilyDetails" key={"employeeFamilyDetails"} initialValue={[{}]} >
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }, index) => {
                            return (
                                <Row key={index} gutter={[24, 16]} style={{ marginBottom: '16px' }}>

                                    <Form.Item name={[name, 'familyMemName']} hidden></Form.Item>

                                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                        <Form.Item label='Relation' name={[name, 'relation']} rules={[{ required: true, message: 'Please Select relation' }]} >
                                            <Select placeholder="Select relation" onChange={(val) => { relationDuplicateValidate(val, name) }}>
                                                {relations.map((v) => (
                                                        <Option key={v.id} value={v.id}>
                                                            {v.relation}
                                                        </Option>
                                                    ))}

                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                        <Form.Item label='Family Member Name' name={[name, 'familyMemName']} rules={[{ required: true, message: 'Name is required' }]}>
                                            <Input placeholder='Enter Family Member Name' />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                        <Form.Item
                                            label='Contact No'
                                            name={[name, 'contactNo']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter your contact number',
                                                },
                                                {
                                                    pattern: /^\d{10}$/,
                                                    message: 'Contact number must be exactly 10 digits',
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder='Enter Contact No'
                                                maxLength={10}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                        <Form.Item label='ID Type' name={[name, 'familyIdType']} rules={[{ required: true, message: 'ID Type is required' }]}>
                                            <Select placeholder="Select id proof" allowClear showSearch onChange={(val) => setIdProofsName(val)}>
                                                {
                                                    idProofs.length && idProofs.map((v) => <Option value={v.id}>{v.name}</Option>)
                                                }
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                        <Form.Item
                                            label='ID Number'
                                            name={[name, 'aadhaarNo']}
                                            rules={[
                                                { required: true, message: 'ID Number is required' },
                                                { validator: validateIDNumber },
                                            ]}
                                        >
                                            <Input
                                                placeholder='Enter ID Number'
                                                maxLength={12}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={8} lg={5} xl={5} style={{ marginLeft: 'auto', textAlign: 'right', marginTop: "23px" }}>
                                        {index === fields.length - 1 && (

                                            <Button type="primary" onClick={() => add()} block style={{ width: '40px' }}>
                                                <PlusOutlined />
                                            </Button>
                                        )}
                                        {fields.length > 1 ? (
                                            <Button type="dashed" danger onClick={() => {remove(index), removeSelectedRelationType(name)}} style={{ width: "20%", marginLeft: "23px" }}>
                                                <MinusCircleOutlined />
                                            </Button>
                                        ) : null}
                                    </Col>

                                </Row >
                            )

                        })}
                    </>
                )}

            </Form.List >

        </>
    )
}

