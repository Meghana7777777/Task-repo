import { PageContainer } from "@ant-design/pro-layout";
import { PayrollComponentsSharedService } from "@hrexpert/shared-services";
import { Button, Modal, notification, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import PayrollCodeGeneration from "./payroll-code-generation";

interface PayrollCodeViewProps {
    payrollGroupCode: any;
    generatedId: any
}

export default function PayrollCodeView(props: PayrollCodeViewProps) {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCodeModalVisible, setCodeModalVisible] = useState(false);
    const [selectedPayrollGroupCode, setSelectedPayrollGroupCode] = useState([])
    const [generatedId, setGeneratedId] = useState(0)
    const service = new PayrollComponentsSharedService();
    const [selectedCodeDefineData, setSelectedCodeDefineData] = useState([])

    useEffect(() => {
        getAllPayrollCodesData()
    }, [])

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedPayrollGroupCode([])
        getAllPayrollCodesData()
    };
    const handleCloseTableModal = () => {
        setCodeModalVisible(false);
        setSelectedCodeDefineData([])
        getAllPayrollCodesData()
    };

    const payrollComponentsByCode = (val) => {
        const req = {
            payrollCode: val
        }
        service.payrollComponentsByCode(req).then((res) => {
            if (res.status) {
                setSelectedPayrollGroupCode(res.data)
            } else {
                setSelectedPayrollGroupCode([])
            }
        })
    }

    const getAllPayrollCodesData = () => {
        service.getAllPayrollCodesData().then((res) => {
            if (res.status) {
                setData(res.data)
            } else {
                setData([])
            }
        })
    }

    function handleReset(clearFilters: any) {
        clearFilters();
        setSearchText("");
    }

    function codeDefinedByPayrollGroup(val) {
        const req = {
            payrollType: val
        }
        service.codeDefinedByPayrollGroup(req).then((res) => {
            if (res.status) {
                setSelectedCodeDefineData(res.data)
            } else {
                notification.info({ message: 'No data against the generated code' })
                setSelectedCodeDefineData([])
            }
        })
    }
    const modalColumns: any = [
        {
            title: "Component Name",
            dataIndex: "componentName",
            width: 150
        },
        {
            title: "Component Type",
            dataIndex: "componentType",
            width: 140,
            render: (t) => t ? t : '-'
        },
        {
            title: "Derived Rule",
            dataIndex: "derivedRule",
            width: 100,
        },
        {
            title: "Cut Off Amount",
            dataIndex: "cutoffAmount",
            width: 120,
            align: "center",
            render: (t) => t ? t : '-'
        },
        {
            title: "Eff Date",
            dataIndex: "effDate",
            width: 70,
            align: "center",
            render: (t) => t ? t : '-'
        },
        {
            title: "Is Derived",
            dataIndex: "isDerived",
            align: "center",
            width: 70,
            render: (value) => (value ? "Yes" : "No")
        },
        {
            title: "Is Esi Earning",
            dataIndex: "isEsiEarning",
            align: "center",
            width: 70,
            render: (value) => (value ? "Yes" : "No")
        },
        {
            title: "Is Gross Derived",
            dataIndex: "isGrossDerived",
            align: "center",
            width: 70,
            render: (value) => (value ? "Yes" : "No")
        },
        {
            title: "Is Pf Earning",
            dataIndex: "isPfEarning",
            align: "center",
            width: 70,
            render: (value) => (value ? "Yes" : "No")
        },
        {
            title: "Round Strg",
            dataIndex: "roundStrg",
            width: 90,
            render: (t) => t ? t : '-'
        },
        {
            title: "Type",
            dataIndex: "type",
            width: 80,
            render: (t) => t ? t : '-'
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            width: 100,
            render: (t) => t ? dayjs(t).format("DD-MM-YYYY") : t
        },
    ];


    const columns: any = [
        {
            title: "S.No",
            key: "sno",
            render: (_, __, index) => index + 1,
            align: "center",
            width: "60px"
        },
        {
            title: 'Payroll Type',
            dataIndex: 'payrollType',
            width: "100px"
        },
        {
            title: 'Payroll Group Code',
            dataIndex: 'payrollCode',
            align: 'center',
            width: "850px",
            render: (val, rec) => {
                return val ? `${rec.state + '/' + rec.payrollCode}` : '-'
            }
        },
        {
            title: "Action",
            dataIndex: "action",
            align: "center",
            render: (text, rowData) => {
                return (
                    <span>
                        <Tooltip title="Detail View">
                            <Button style={{ width: "50px", borderColor: "black" }}
                                onClick={() => { codeDefinedByPayrollGroup(rowData.payrollType), setCodeModalVisible(true) }}
                            >
                                View
                            </Button>
                        </Tooltip>
                    </span>
                )
            }
        }
    ]

    return (
        <PageContainer title='Payroll Group Code' breadcrumbRender={false}>
            <Table columns={columns} dataSource={data} bordered scroll={{ y: 'calc(70vh-100px)' }} />
            <Modal
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={1400}
            >
                {selectedPayrollGroupCode.length > 0 ? (
                    <PayrollCodeGeneration payrollGroupCode={selectedPayrollGroupCode} generatedId={generatedId} handleCloseModal={handleCloseModal} />
                ) : (
                    <p>Loading...</p>
                )}
            </Modal>
            <Modal
                open={isCodeModalVisible}
                onCancel={handleCloseTableModal}
                footer={null}
                width={1300}
            >
                <Table columns={modalColumns} dataSource={selectedCodeDefineData} pagination={false} scroll={{ y: 'calc(70vh - 120px)' }} />
            </Modal>
        </PageContainer>
    );
}