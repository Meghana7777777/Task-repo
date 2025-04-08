import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { JobReq, ScopesEnum } from "@hrexpert/shared-models";
import { JobsService } from "@hrexpert/shared-services";
import { Button, Checkbox, Divider, Form, Input, message, Modal, Popconfirm, Space, Switch, Table, Tag } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import { SequenceUtils } from "../../../../../app/common/utils";
import { useIAMClientState } from "../../../../common/iam-client-react";
import JobsView from "./jobs-form";
import { Excel } from "antd-table-saveas-excel";

interface JobsViewIProps {
    scopes: ScopesEnum[]
}

const JobsGrid = (props: JobsViewIProps) => {
    const { scopes } = props
    const [data, setData] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [isUpdate, setisUpdate] = useState(false)
    const jobsService = new JobsService();
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const [pageSize, setPageSize] = useState<number>(1);

    useEffect(() => {
        getAllJobs();
    }, []);

    const getAllJobs = () => {
        try {
            jobsService.getAllJobs().then((res) => {
                if (res.status) {
                    setData(res.data)
                }
                else {
                    message.error("Failed to retrieve Jobs");
                }
            })
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const updateJobDetails = (data: JobReq) => {
        data.updatedUser = IAMClientAuthContext.user.employeeCode
        jobsService.updateJob(data)
            .then((res) => {
                if (res.status) {
                    message.success("Job updated successfully");
                    setModalVisible(false);
                    getAllJobs();
                    setisUpdate(false);
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating job details:", error);
            });
    };

    const deleteJob = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new JobReq();
        req.id = rowData.id
        req.isActive = newIsActive
        req.versionFlag = rowData.versionFlag
        req.updatedUser = IAMClientAuthContext.user.employeeCode
        try {
            jobsService.activateOrDeactivateJob(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllJobs();
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    const openForm = () => {
        setSelectedData(null);
        setModalVisible(true);
    };

    const editJob = (rowData: any) => {
        setSelectedData(rowData);
        setModalVisible(true);
        setisUpdate(true);
    };


    const closeModal = () => {
        setModalVisible(false);
        setisUpdate(false);
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
    /**
     *
     * @param selectedKeys
     * @param confirm
     * @param dataIndex
     */
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
    const jobs = [
        { title: "Job Code", dataIndex: "jobCode"},
        { title: 'job Description', dataIndex: 'jobDescription' },
    ];

    const preprocessData = (data) => {
        return data.map((record, index) => {
            const updatedRecord = { key: index + 1 }; 
            jobs.forEach((column) => {
                const value = record[column.dataIndex];
                updatedRecord[column.dataIndex] =
                    value === null || value === undefined ? "" : value;
            });
            return updatedRecord;
        });
    };
  
  const exportExcel = () => {
  const excel = new Excel();
  const processedData = preprocessData(data); 
   excel
      .addSheet('jobs')
      .addColumns(jobs)
      .addDataSource(processedData, { str2num: false }) 
      .saveAs('Jobs.xlsx');
  };

    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
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
            title: "Status",
            dataIndex: "isActive",
            align: "center",
            ...getColumnSearchProps("isActive"),
            render: (isActive, rowData) => (
                <>
                    {isActive ? (
                        <Tag icon={<CheckCircleOutlined />} color="#87d068">
                            Active
                        </Tag>
                    ) : (
                        <Tag icon={<CloseCircleOutlined />} color="#f50">
                            Inactive
                        </Tag>
                    )}
                </>
            ),
            filterIcon: (filtered: boolean) => (
                <FilterOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
            ),
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }: any) => (
                <div
                    className="custom-filter-dropdown"
                    style={{ flexDirection: "row", marginLeft: 10 }}
                >
                    <Checkbox
                        checked={selectedKeys.includes('Active')}
                        onChange={() =>
                            setSelectedKeys(
                                selectedKeys.includes('Active') ? [] : ['Active']
                            )
                        }
                    >
                        <span style={{ color: "green" }}>Active</span>
                    </Checkbox>
                    <Checkbox
                        checked={selectedKeys.includes('Inactive')}
                        onChange={() =>
                            setSelectedKeys(
                                selectedKeys.includes('Inactive') ? [] : ['Inactive']
                            )
                        }
                    >
                        <span style={{ color: "red" }}>Inactive</span>
                    </Checkbox>
                    <div className="custom-filter-dropdown-btns">
                        <Button
                            onClick={() => {
                                handleReset(clearFilters);
                                confirm();
                            }}
                            className="custom-reset-button"
                        >
                            Reset
                        </Button>
                        <Button
                            type="primary"
                            style={{ margin: 10 }}
                            onClick={() => confirm()}
                            className="custom-ok-button"
                        >
                            OK
                        </Button>
                    </div>
                </div>
            ),
            onFilter: (value, record) => {
                if (typeof value === 'string') {
                    const status = record.isActive ? 'Active' : 'Inactive';
                    return value === status;
                }
                return false;
            },
        },
        {
            title: "Action",
            dataIndex: "action",
            align: "center",
            render: (text, rowData) => (
                <span>
                    {rowData.isActive ? (
                        <EditOutlined
                            className={"editSamplTypeIcon"}
                            type="edit"
                            onClick={() => {
                                if (rowData.isActive) {
                                    editJob(rowData);
                                }
                            }}
                            style={{ color: "#1890ff", fontSize: "14px", display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }}
                        />
                    ) : (
                        ""
                    )}
                    <Divider type="vertical" />
                    <Popconfirm
                        onConfirm={(e) => {
                            deleteJob(rowData);
                        }}
                        title={
                            rowData.isActive
                                ? "Are you sure to Deactivate Job?"
                                : "Are you sure to Activate Job?"
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
        },
    ];

    return (
        <>
            <PageContainer title='Jobs' breadcrumbRender={false}
                extra={
                    <>
                    <Button type="primary" disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)} icon={<PlusOutlined />} onClick={openForm}>
                        Add
                    </Button>
                    <Button  style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>
                        Get Excel
                    </Button>

                    </>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    size="small"
                    pagination={{
                        pageSize: 20,
                        onChange(current,pageSize) {
                            setPage(current);
                            setPageSize(pageSize);
                        },
                    }}
                    rowKey="id"
                />

                <Modal
                    title={isUpdate ? "Update Jobs" : "Create Jobs"}
                    open={modalVisible}
                    onCancel={closeModal}
                    footer={null}
                    width="60%"
                    key={data.id}
                >
                    <JobsView
                        key={Date.now()}
                        updateDetails={updateJobDetails}
                        isUpdate={isUpdate}
                        jobsData={selectedData}
                        closeForm={closeModal}
                        getAllJobs={getAllJobs}
                    />

                </Modal>

            </PageContainer>
        </>
    );
};

export default JobsGrid;
