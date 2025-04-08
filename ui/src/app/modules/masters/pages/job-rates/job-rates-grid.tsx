import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { JobRatesActivateDeactivateReq, ScopesEnum } from '@hrexpert/shared-models';
import { BranchesService, JobRatesSharedService, JobsService } from '@hrexpert/shared-services';
import { Button, Checkbox, Input, message, Modal, Popconfirm, Space, Switch, Table, Tag } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import { SequenceUtils } from "../../../../common/utils";
import JobRatesForm from './job-rates-form';
import dayjs from 'dayjs';
import { Excel } from 'antd-table-saveas-excel';



interface JobRatesGridIProps {
    scopes: ScopesEnum[]
}

const JobRateGrid = (props: JobRatesGridIProps) => {
    const { scopes } = props
    const [open, setOpen] = useState(false);
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = useState<number>(1);
    const [jobRatesData, setJobRateData] = useState<any>([])
    const [selectedData, setSelectedData] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isUpdate, setisUpdate] = useState(false)
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const service = new JobRatesSharedService()
    const branchesService = new BranchesService()
    const jobsService = new JobsService();
    const [activeBranchesData, SetActiveBranchesData] = useState<any>();
    const [jobsData, SetJobsData] = useState<any>();
    const jobRatesSharedservice = new JobRatesSharedService();
    

    useEffect(() => {
        getJobRates()
        getActiveBranches()
        getActiveJobs()
    }, [])

    const getActiveBranches = () => {
        try {
            branchesService.getActiveBranches().then((res) => {
                if (res.status) {
                    SetActiveBranchesData(res.data)
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getActiveJobs = () => {
        try {
            jobsService.getActiveJobs().then((res) => {
                if (res.status) {
                    SetJobsData(res.data)
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getJobRates = () => {
        setLoading(true)
        try {
            service.getJobRates().then((res) => {
                if (res.status) {
                    setJobRateData(res.data)
                    setLoading(false)
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const activateDeactivateJobRates = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new JobRatesActivateDeactivateReq(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateDeactivateJobRates(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getJobRates();
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    const updateJobRates = (formData: any) => {
        try {
          jobRatesSharedservice.updateJobRates(formData)
            .then((res) => {
              if (res.status) {
                message.success("Updated SuccessFully");
                getJobRates()
                setModalVisible(false);
                setisUpdate(false);
              } else {
                message.error(res.internalMessage);
              }
            })
        } catch (error) {
          console.error("Error Updating Job Rate Details:", error);
        }
      };
    

    const openForm = () => {
        setSelectedData(null);
        setModalVisible(true);
    };

    const editDepartment = (rowData: any) => {
        console.log(rowData, '-0-0000-')
        setSelectedData(rowData);
        setModalVisible(true);
        setisUpdate(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setisUpdate(false);
        getJobRates()
    };

    const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys as string[], confirm, dataIndex)
                    }
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys as string[], confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            handleReset(clearFilters);
                            setSearchedColumn(dataIndex);
                            confirm({ closeDropdown: true });
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase())
                : false,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                // setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    }

    function handleReset(clearFilters: any) {
        clearFilters();
        setSearchText("");
    }

    let i = 1;
    const jobRates = [
        { title: "Job Code", dataIndex: "jobCode"},
        { title: 'Job Description', dataIndex: 'jobDescription' },
        { title: 'Branch Name', dataIndex: 'branchName' },
        { title: 'Eff From Date', dataIndex: 'effFromDate' },
        { title: 'Rate', dataIndex: 'rate' },
    ];

    const preprocessData = (data) => {
        return data.map((record, index) => {
            const updatedRecord = { key: index + 1 }; 
            jobRates.forEach((column) => {
                const value = record[column.dataIndex];
                updatedRecord[column.dataIndex] =
                    value === null || value === undefined ? "" : value;
            });
            return updatedRecord;
        });
    };
  
  const exportExcel = () => {
  const excel = new Excel();
  const processedData = preprocessData(jobRatesData); 
   excel
      .addSheet('jobRates')
      .addColumns(jobRates)
      .addDataSource(processedData, { str2num: false }) 
      .saveAs('Job Rates.xlsx');
  };

    const columns: ColumnsType<any> = [

        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
            align: "center"
        },
        {
            title: "Job Code",
            dataIndex: "jobCode",
            ...getColumnSearchProps("jobCode"),
            align: "center"
        },
        {
            title: "Job Description",
            dataIndex: "jobDescription",
            ...getColumnSearchProps("jobDescription"),
            align: "center"
        },
        {
            title: "Branch Name",
            dataIndex: "branchName",
            ...getColumnSearchProps("branchName"),
            align: "center"
        },
        {
            title: "Eff From Date",
            dataIndex: "effFromDate",
            ...getColumnSearchProps("effFromDate"),
            align: "center"

        },
        {
            title: "Rate",
            dataIndex: "rate",
            ...getColumnSearchProps("rate"),
            align: "center"
        },
        {
            title: 'Action',
            align: "center",
            render: (text, rowData) => (
                <span>
                    {rowData.isActive ? (
                        <EditOutlined
                            className={"editSamplTypeIcon"}
                            type="edit"
                            onClick={() => {
                                if (rowData.isActive) {
                                    editDepartment(rowData);
                                }
                            }}
                            style={{ color: "#1890ff", fontSize: "14px", display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }}
                        />
                    ) : (
                        ""
                    )}
                    &nbsp; &nbsp; &nbsp;
                    <Popconfirm
                        onConfirm={(e) => {
                            activateDeactivateJobRates(rowData);
                        }}
                        title={
                            rowData.isActive
                                ? "Are you sure to Deactivate ?"
                                : "Are you sure to Activate ?"
                        }
                    >
                        <Switch
                            size="default"
                            disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Delete)}
                            className={
                                rowData.isActive ? "toggle-activated" : "toggle-deactivated"
                            }
                            checkedChildren={<RightSquareOutlined type="check" />}
                            unCheckedChildren={<RightSquareOutlined type="close" />}
                            checked={rowData.isActive}
                        />
                    </Popconfirm>
                </span>
            ),
        }
    ]

    return (
        <>
            <PageContainer title='Job Rates' breadcrumbRender={false}
                extra={
                    <Space>
                        <Button
                            type="primary"
                            disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)}
                            icon={<PlusOutlined />}
                            onClick={openForm}
                        >
                            Add
                        </Button>
                        <Button  style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>
                        Get Excel
                    </Button>

                    </Space >
                }>
                <Table
                    loading={loading}
                    dataSource={jobRatesData}
                    columns={columns}
                    size={"small"}
                    pagination={{
                        pageSize:20,
                        onChange(current,pageSize) {
                            setPage(current);
                            setPageSize(pageSize);
                        },
                    }}
                    rowKey="id" />
            </PageContainer >

            <Modal
                key={jobRatesData.id}
                title={isUpdate ? "Update Job Rate" : "Create Job Rate"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width="60%"
            >
                <JobRatesForm
                    key={Date.now()}
                    isUpdate={isUpdate}
                    jobRatesData={selectedData}
                    closeForm={closeModal}
                    branchData={activeBranchesData}
                    jobsData={jobsData}
                    updateDetails={updateJobRates}
                />
            </Modal>
        </>
    )
}
export default JobRateGrid