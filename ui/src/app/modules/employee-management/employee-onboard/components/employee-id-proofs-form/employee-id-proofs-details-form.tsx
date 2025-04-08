import { FolderViewOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { configVariables, IdProofService } from '@hrexpert/shared-services'
import { Button, Col, Form, FormInstance, Input, message, Modal, Row, Select, Upload } from 'antd'
import { useEffect, useState } from 'react'
const { Option } = Select
export interface EmployeeIdProofsDetailsFormProps {
    form: FormInstance<any>
    isUpdate: boolean
    employeeData?: any
}
const EmployeeIdProofsDetailsForm = (props: EmployeeIdProofsDetailsFormProps) => {
    const { form } = props
    const [idProofs, setIdProofs] = useState([])
    const idProofService = new IdProofService()
    const [fileList, setFileList] = useState<any[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [idProofName, setIdProofsName] = useState<number>()
    const docUrl = configVariables.ID_PROOF_UPLOAD_URL
    const [onIsUpdateUploadChange, setOnIsUpdateUploadChange] = useState<boolean>(false)
    const [ModalOpen, setModalOpen] = useState(false);
    const [pdfViewindex, setPdfViewindex] = useState<string>();
    const [selectedIdProofs, setSelectedIdProofs] = useState<any>([])
    const [maxLength, setMaxLength] = useState();
    useEffect(() => {
        getIdProofs()
    }, [])

    const getIdProofs = () => {
        idProofService.getActiveIdProofs().then((idProofs) => {
            if (idProofs.status) {
                setIdProofs(idProofs.data)
            }
        })
    }

    useEffect(() => {
        const values = form.getFieldValue("employeeIdProofs");
        if (!values || values.length === 0) {
            form.setFieldsValue({ employeeIdProofs: [{}] });
        }
    }, []);

    const handleFileChange = (index, newList) => {
        const updatedFileLists = [...fileList];
        updatedFileLists[index] = newList;
        setFileList(updatedFileLists);
        if (props.isUpdate) {
            setOnIsUpdateUploadChange(true)
        }
    };

    const handleRemoveRow = (index: number, name: any) => {
        const updatedFileLists = [...fileList];
        updatedFileLists.splice(index, 1);
        setFileList(updatedFileLists);
        const updatedTypes = [...selectedTypes];
        updatedTypes.splice(index, 1);
        setSelectedTypes(updatedTypes);
        const fields = form.getFieldValue('employeeIdProofs');
        if (!fields || !fields[name] || !fields[name].idType) {
            console.error("Invalid field data");
            return;
        }
        const updatedSelectedEdu = selectedIdProofs.filter(
            (item) => item === fields[name].empQualification
        );
        setSelectedIdProofs(updatedSelectedEdu);
    };



    const uploadProps = (index) => ({
        multiple: false,
        onRemove: (file) => {
            const updatedList = fileList[index].filter((rec) => rec.uid !== file.uid);
            handleFileChange(index, updatedList);
        },
        beforeUpload: (file) => {
            if (!file.name.match(/\.(jpg|png|jpeg|JPG|JPEG|PNG|pdf|PDF)$/)) {
                message.error("Only jpg,png,jpeg,JPG,JPEG,PNG,PDF files are allowed.");
                return false;
            }
            const newList = [file];
            handleFileChange(index, newList);

            return false;
        },
        fileList: fileList[index] || [],
        defaultFileList: fileList[index] || [],
        showUploadList: true,
    });

    const getMaxLengthFromRegex = (regex) => {
        const lengthMatches = regex.match(/\{(\d+)\}/g);
        if (!lengthMatches) return regex.replace(/[^A-Z0-9]/g, '').length;
        return lengthMatches.reduce((total, match) => {
            const length = parseInt(match.replace(/[{}]/g, ''), 10);
            return total + length;
        }, 0);
    };

    const validateIDNumber = (_, value) => {
        const id = idProofs.find((rec) => rec.id === idProofName);
        if (id && id.regex) {
            const regex = new RegExp(id.regex.slice(1, -1));
            const maxLength = getMaxLengthFromRegex(id.regex);
            setMaxLength(maxLength);
            if (value && !regex.test(value)) {
                // console.warn(`Invalid ${id.name} Number`);
                return Promise.reject(`Please Enter Valid ${id.name} Number`);
            }
        }
        setIdProofsName(null);
        // console.log(`Validation Passed for ${id?.name || 'Unknown ID Type'}`);
        return Promise.resolve();
    };

    const idProofsDuplicateValidate = (val: any, name: any) => {
        if (selectedIdProofs.includes(val)) {
            message.error('Id Proof Already selected')
            const fields = form.getFieldValue('employeeIdProofs');
            fields[name].idType = null
            form.setFieldsValue({ employeeIdProofs: fields });
        } else {
            setSelectedIdProofs([...selectedIdProofs, val]);
        }
    };

    const pdfPreview = (index) => {
        setModalOpen(true)
        setPdfViewindex(index)
    }


    return (
        <>
            <Form.List name="employeeIdProofs" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }, index) => {
                            return (
                                <Row gutter={[24, 16]} style={{ marginBottom: '16px' }}>
                                    <Form.Item name={[name, 'id']} hidden></Form.Item>
                                    <Form.Item name='employeeId' hidden></Form.Item>

                                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                        <Form.Item label='ID Type' name={[name, 'idType']} rules={[{ required: true, message: 'ID Type is required' }]}>
                                            <Select placeholder="Select id proof" allowClear showSearch onChange={(val) => { setIdProofsName(val), idProofsDuplicateValidate(val, name) }}>
                                                {idProofs.length && idProofs.map((v) => (
                                                    <Option key={v.id} value={v.id}>{v.name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Form.Item
                                        label='ID Number'
                                        name={[name, 'idNumber']}
                                        rules={[
                                            { required: true, message: 'ID Number is required' },
                                            { validator: validateIDNumber },
                                        ]}
                                    >
                                        <Input
                                            placeholder='Enter ID Number'
                                            maxLength={maxLength}
                                        />
                                    </Form.Item>

                                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                        <Form.Item
                                            name={[name, 'file']}
                                            label="Document Upload"
                                            rules={[{ required: !props.isUpdate, message: 'Upload is required' }]}

                                        >
                                            <Upload
                                                key={`upload-${index}`}
                                                showUploadList={true}
                                                {...uploadProps(index)}
                                                style={{ width: "100%" }}
                                            >
                                                <Button icon={<UploadOutlined />}>Upload</Button>
                                            </Upload>
                                        </Form.Item>
                                    </Col>

                                    {(fileList[index]?.length > 0 || (props.isUpdate && props?.employeeData[index]?.file) ?
                                        <Col xs={5} sm={8} md={6} lg={4} xl={3} style={{ textAlign: "center", marginTop: 20 }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <FolderViewOutlined style={{ fontSize: '40px', color: '#1677ff' }} onClick={() => pdfPreview(index)} />
                                            </div>
                                        </Col> : <></>
                                    )}

                                    <Col xs={24} sm={12} md={8} lg={4} xl={4} style={{ marginLeft: 'auto', textAlign: 'right', marginTop: "23px" }}>
                                        {index === fields.length - 1 && (
                                            <Button type="primary" onClick={() => add()} block style={{ width: "20%" }}>
                                                <PlusOutlined />
                                            </Button>
                                        )}
                                        {fields.length > 1 ? (
                                            <Button type="dashed" danger onClick={() => { remove(index), handleRemoveRow(index, name); }} style={{ width: "20%", marginLeft: "23px" }}>
                                                <MinusCircleOutlined />
                                            </Button>
                                        ) : null}
                                    </Col>

                                </Row>
                            )
                        })}
                    </>
                )}

            </Form.List>

            <Modal
                open={ModalOpen}
                footer={null}
                onCancel={() => setModalOpen(false)}
                width="50%"
                height='50%'
            >
                <iframe
                    width="80%"
                    height="800px"
                    src={
                        props.isUpdate
                            ? docUrl + (props?.employeeData[pdfViewindex]?.file || '')
                            : fileList && fileList[pdfViewindex]?.[0] instanceof File
                                ? URL.createObjectURL(fileList[pdfViewindex][0])
                                : ''
                    }
                ></iframe>
            </Modal>
        </>

    )
}

export default EmployeeIdProofsDetailsForm