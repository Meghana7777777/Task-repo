import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Form, Select, Button, Input, message, Upload, Typography, UploadProps } from 'antd';
import { UndoOutlined, UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { AlertMessages, DocumentModelDto, DocumentTypeEnum, DomainEnum, DomainModelDto, ReferenceFeatures } from '@hrexpert/shared-models';
import { BranchesService, CompanySharedService, DocumentSharedService, DocumentTypeSharedService, DomainSharedService, FileHandlingService } from '@hrexpert/shared-services';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

export interface FileUploadProps {
    data: any;
    updatedFilesData?: any[];
}

const KnowlegdeRepositoryForm = () => {
    const [form] = Form.useForm();
    const [domains, setDomains] = useState<DomainModelDto[]>([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [company, setCompany] = useState<any[]>([]);
    const documentSharedService = new DocumentSharedService();
    const fileHandlingService = new FileHandlingService();
    const domainService = new DomainSharedService();
    const documentTypeService = new DocumentTypeSharedService();
    const companySharedService = new CompanySharedService();
    const branchesService = new BranchesService();
    const [fileList, setFileList] = useState<any[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getDomains();
        getCompany();
    }, [])

    useEffect(() => {
        if (selectedDomain) {
            getDocumentTypes(selectedDomain);
        }
    }, [selectedDomain]);

    useEffect(() => {
        if (selectedCompany) {
            getBranchByCompany(selectedCompany);
        }
    }, [selectedCompany]);

    const handleNavigate = () => {
        navigate('/view-documents');
    };

    const getDomains = async () => {
        try {
            const response = await domainService.getDomianType();
            if (response && response.status) {
                setDomains(response.data);
            } else {
                message.error('Failed to fetch domain data');
            }
        } catch (error) {
            message.error('Error fetching domain data');
        }
    }

    const getDocumentTypes = async (domain: string) => {
        if (!domain) return;
        try {
            const response = await documentTypeService.getDocumentTypesByDomain(domain);
            if (response && response.status) {
                setDocumentTypes(response.data);
            } else {
                setDocumentTypes([]);
                message.warning(`No document types found for the selected domain: ${domain}`);
            }
        } catch (error) {
            message.error('Error fetching document types');
            setDocumentTypes([]);
        }
    };

    const getBranchByCompany = async (companyName: any) => {
        if (!companyName) return;
        try {
            const response = await branchesService.getBranchesByCompany(companyName);

            if (response) {
                setBranches(response.data);
            } else {
                setBranches([]);
                message.warning(`No branches found for the company: ${companyName}`);
            }
        } catch (error) {
            message.error('Error fetching branches');
            setBranches([]);
        }
    };


    const handleBranchChange = (companyName: any) => {
        setSelectedCompany([companyName]);
    };

    const getCompany = async () => {
        try {
            const response = await companySharedService.getCompany();
            if (response && response.status) {
                setCompany(response.data);
            } else {
                setCompany([]);
                message.warning(`No document types found for the selected company`);
            }
        } catch (error) {
            message.error('Error fetching document types');
            setCompany([]);
        }
    };

    const handleDomainChange = (domain: string) => {
        setSelectedDomain(domain);
        form.setFieldsValue({ document_type: null });
    };

    const handleReset = () => {
        form.resetFields();
        setSelectedDomain(null);
    }

    const generateUniqueId = () => {
        return Math.floor(1000 + Math.random() * 9000);
    };

    const fileHandling = async (uploadedFiles: any, file_id_unq: any) => {
        try {
            const formData = new FormData();
            if (uploadedFiles?.length) {
                formData.append('id', `${file_id_unq}`);
                formData.append('featuresRefName', ReferenceFeatures.KR);
                formData.append('createdUser', ``);
                for (let i = 0; i < uploadedFiles?.length; i++) {
                    formData.append('file', uploadedFiles?.[i]);
                }
            }
            await fileHandlingService.fileUpload(formData);
        } catch (error) {
            AlertMessages.getErrorMessage("File not uploaded");
            console.log(error);
        }
    };

    const handleSubmit = async (values: any) => {
        console.log('Received values of form: ', values);
        try {
            let file_id_unq = generateUniqueId();
            const documentData: DocumentModelDto = {
                ...values,
                file_id_unq,
                branch: values.branch || [],
                created_date: new Date().toISOString(),
                file: values.file && values.file[0]?.originFileObj ? values.file[0].originFileObj : null,
            };
            const documentResponse = await documentSharedService.addDocument(documentData);
            if (documentResponse.status) {
                await fileHandling(fileList, file_id_unq);
                setFileList([]);
                form.resetFields();
                message.success('Document added successfully');
                navigate('/view-documents')
            } else {
                console.error('Error adding document:', documentResponse);
                message.error(documentResponse.status || 'Error occurred while adding document');
            }
        } catch (error: any) {
            console.error('Error adding document:', error);
            message.error(error.message || 'Error occurred while adding document');
        }
    };


    const uploadFabricProps: UploadProps = {
        multiple: true,
        onRemove: file => {
            let files: any[] = fileList?.filter((f) => f.uid != file.uid);
            setFileList(files);
        },
        beforeUpload: (file: any, files: any) => {
            if (!file.name.match(/\.(pdf|xlsx|xls|png|jpeg|PNG|jpg|JPG|pjpeg|gif|tiff|x-tiff|x-png|ppt|pptx|doc|docx|csv|zip)$/)) {
                AlertMessages.getErrorMessage("Only pdf,xlsx,xls,png,jpeg,jpg files are allowed!");
                return true;
            }
            setFileList([...fileList, ...files]);
            return false;
        },
        fileList: fileList,
    };

    return (
        <PageContainer
            extra={[
                <>
                    <Button key="add" style={{ marginRight: 10, borderColor: '#1677ff', color: '#1677ff' }} onClick={handleNavigate}>
                        View Documents
                    </Button>
                </>
            ]}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="form">
                <Row gutter={24}>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }}>
                        <Form.Item
                            name="company"
                            label="Company"
                            rules={[{ required: true, message: 'Please select a Company' }]}
                        >
                            <Select placeholder="Please Select Company"
                                allowClear
                                showSearch
                                onChange={handleBranchChange}
                            >
                                {company.map((todo) => (
                                    <Select.Option key={todo.id} value={todo.companyName}>
                                        {todo.companyName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }}>
                        <Form.Item
                            name="branch"
                            label="Branch"
                            rules={[{ required: true, message: 'Please select a Branch' }]}
                        >
                            <Select placeholder="Please Select Branch"
                                allowClear
                                showSearch
                                mode='multiple'
                            >
                                {branches.map((todo) => (
                                    <Select.Option key={todo.id} value={todo.branchName}>
                                        {todo.branchName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }}>
                        <Form.Item
                            name="domain"
                            label="Category"
                            rules={[{ required: true, message: 'Please select a Category' }]}
                        >
                            <Select placeholder="Please Select Category"
                                allowClear
                                showSearch
                                onChange={handleDomainChange}
                            >
                                {domains.map((domain) => (
                                    <Select.Option key={domain.domainId} value={domain.domainType}>
                                        {domain.domainType}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="document_type" label="Category Type" rules={[{ required: true, message: 'Please select a Category type' }]}>
                            <Select placeholder="Please Select Category Type" allowClear showSearch>
                                {documentTypes.map((docType) => (
                                    <Select.Option key={docType.documentTypeId} value={docType.documentType}>
                                        {docType.documentType}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }}>
                        <Form.Item
                            name="document_name"
                            label="Document Name"
                            rules={[{ required: true, message: 'Please Enter Document Name' },
                            { pattern: /^[a-zA-Z0-9 ]*$/, message: 'Only alphabets and numbers are allowed' }
                            ]}

                        >
                            <Input placeholder="Please Enter Document Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }}>
                        <Form.Item
                            name="created_by"
                            label="Created By"
                            rules={[{ required: true, message: 'Please Select Created By' },
                            { pattern: /^[a-zA-Z0-9 ]*$/, message: 'Only alphabets and numbers are allowed' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                </Row>

                <Row gutter={24}>

                    <Col xs={{ span: 12 }} sm={{ span: 12 }} md={{ span: 16 }} lg={{ span: 10 }} xl={{ span: 8 }}>
                        <Form.Item name="remarks" label="Remarks">
                            <Input.TextArea rows={2} placeholder="Please Enter Remarks" />
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }}>
                        <Form.Item name={'attachment'} label='Attach File'>
                            <Upload
                                multiple
                                style={{ width: '100%' }}
                                {...uploadFabricProps}
                                accept=".pdf, .xlsx, .xls, .png, .jpeg, .jpg, .pjpeg, .gif, .tiff, .x-tiff, .x-png, .pptx, .ppt, .doc, .docx, .zip, .csv"
                                fileList={fileList}
                            >
                                <Button
                                    style={{ color: 'black', }}
                                    icon={<UploadOutlined />}
                                >
                                    Upload File
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="start" gutter={12}>
                    <Col>
                        <Form.Item>
                            <Button htmlType="submit" style={{ borderColor: '#1677ff', color: '#1677ff' }}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item>
                            <Button onClick={handleReset}
                                icon={<UndoOutlined />}
                                style={{ borderColor: '#ff4d4f', width: '60px', borderStyle: 'dashed', color: '#FF4D50' }}>
                                Reset
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </PageContainer>
    );
};


export default KnowlegdeRepositoryForm