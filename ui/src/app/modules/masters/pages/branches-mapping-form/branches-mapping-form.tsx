import { UndoOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { BranchesMappingSharedDto } from "@hrexpert/shared-models";
import { BranchesMappingSharedService, BranchesService, DepartmentService, DivisionService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button,Col, Form, FormInstance, Input,  message,  Row, Select, Space} from "antd";
import { useEffect, useRef, useState } from "react";

export interface Props {
    branchMappingData?: BranchesMappingSharedDto;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    BranchMapping?: FormInstance<any>;
    getBranchesMapping: () => void
    form : any
}
export default function BranchMapping(props:Props) {
    const [data, setData] = useState<any[]>([]);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [deptData, setDeptData] = useState<any[]>([])
    const [inputChange, setInputChange] = useState<boolean>(false)
    const [branches, setBranches] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const branchMappingService = new BranchesMappingSharedService()
    const branchService = new BranchesService();
    const { Option } = Select
    const deptService = new DepartmentService()
    const divisionService = new DivisionService()

    useEffect(()=>{
        console.log(props.branchMappingData)
    },[props.branchMappingData])


    const [form] = Form.useForm();


    useEffect(() => {
        getAllBranches()
        getAllDepartments()
        getAllDivision()
    }, []);

    const getAllBranches = () => {
        try {
            branchService.getAllBranches().then((res) => {
                if (res.status) {
                    setBranches(res.data);
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getAllDivision = () => {
        divisionService.getAllDivision().then((res) => {
            if (res.status) {
                setDivisions(res.data)
            } else {
                setDivisions('No Data Found')
            }
        })
    }

    const getAllDepartments = () => {
        deptService.getAllDepartments().then(res => {
            if (res.status) {
                setDeptData(res.data)
            } else {
                setDeptData([])
            }
        })
    }

    const createBranchMapping = async (val: BranchesMappingSharedDto) => {        
        try {
            branchMappingService.createBranchMapping(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    props.closeForm()
                    props.getBranchesMapping()
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.error(error);
        } 
    };


    const onReset = () => {
        form.resetFields(['branchId', 'divisionId', 'departmentId'])
        setData([])
        setInputChange(false)
        setSelectedRowKeys([])
    }

    const saveData = (val:any) => {
        if (props.isUpdate) {
            props.updateDetails({ ...val, id: props.branchMappingData?.id });
        }
        else {
            createBranchMapping(val)
        }
    }

    return (
        <PageContainer title='Branches Mapping' breadcrumbRender={false}
        >
            <Form form={form}  layout="vertical" onFinish={saveData} initialValues={props.branchMappingData}>
                <Row gutter={24}>
                <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Branch" name="branchId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a branch',  
                                },
                            ]}>
                            <Select showSearch
                                allowClear
                                placeholder="Select Branch"
                                dropdownMatchSelectWidth={false}
                                optionFilterProp="children"
                                >
                                {branches.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Division" name="divisionId">
                            <Select showSearch allowClear placeholder="Select Division" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                {divisions.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.divisionName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item label={'Department'} name={'departmentId'}  >
                            <Select showSearch allowClear placeholder="Select Department" dropdownMatchSelectWidth={false}
                                optionFilterProp="children">
                                {deptData.map(dept => {
                                    return <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ant-submit-btn"
                                style={{ marginLeft: 20, marginTop: 23 }}
                            >
                                {props.isUpdate ? "Update" : "Submit"}
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="default"
                                danger
                                icon={<UndoOutlined />}
                                onClick={onReset}
                                style={{ marginLeft: 20, marginTop: 23 }}
                            >
                                Reset
                            </Button>
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </PageContainer>
    );
}
