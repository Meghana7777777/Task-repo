import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { RelationsActivateDeactivateDto, RelationsDto, ScopesEnum, ShiftActivateDeactivateDto } from "@hrexpert/shared-models";
import { RelationsService } from "@hrexpert/shared-services";
import { Button, Card, Checkbox, Divider, Form, Input, message, Modal, Popconfirm, Space, Switch, Table, Tag } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import RelationForm from "../relation-form/relation-form";
import { PageContainer } from "@ant-design/pro-layout";
import { SequenceUtils } from "../../../../../app/common/utils";
import { Excel } from "antd-table-saveas-excel";



interface BranchMappingGridIProps {
    scopes: ScopesEnum[]
}


const RelationsGrid = (props:BranchMappingGridIProps) => {
const {scopes} =props
    const [data, setData] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [selectedStyleData, setSelectedStyleData] = useState<any>(null);
    const service = new RelationsService();
    const [isUpdate, setisUpdate] = useState(false)
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    let navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState<number>(1);

    useEffect(() => {
        getAllRelations();
    }, []);

    const getAllRelations = () => {
        try {
            service.getAllRelations().then((res) => {
                if (res.status) {
                    setData(res.data)
                }
                else {
                    message.error("Failed to retrieve branches");
                }
            })
        } catch (error) {
            console.log(error);

        }
        setLoading(false);
    };

    const updateRelationsDetails = (data: RelationsDto) => {
        console.log(data, 'data');

        service.updateRelations(data)
            .then((res) => {
                if (res.status) {
                    message.success("Relations updated successfully");
                    setModalVisible(false);
                    getAllRelations();
                    setisUpdate(false);
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating Relations details:", error);
            });
    };

    const deleteRelations = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new RelationsActivateDeactivateDto(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateOrDeactivateRelations(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllRelations();
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    const openForm = () => {
        setSelectedStyleData(null); // Reset form for new entry
        setModalVisible(true);
    };

    const editRealtion = (rowData: any) => {

        setSelectedStyleData(rowData);
        setModalVisible(true);
        setisUpdate(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setisUpdate(false);
    };

    const getColumnSearchProps = (dataIndex: any): ColumnType<string> => ({
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
    const relations = [
        { title: 'Relations', dataIndex: 'relation' },
    ];

    const preprocessData = (data) => {
        // Filter out records where isActive is 0
        const filteredData = data.filter(record => record.isActive !== 0);
        
        return filteredData.map((record, index) => {
            const updatedRecord = { key: index + 1 };
            relations.forEach((column) => {
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
      .addSheet('relations')
      .addColumns(relations)
      .addDataSource(processedData, { str2num: false }) 
      .saveAs('Relations.xlsx');
  };

    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
            responsive: ["sm"],
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
            align: "center"
        },
        {
            title: "Relations",
            dataIndex: "relation",
            ...getColumnSearchProps("relation"),
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
            title: `Action`,
            dataIndex: 'action',
            width: 200,
            align: 'center',
            render: (text, rowData) => (
                <span>
                    <EditOutlined className={'editSamplTypeIcon'} type="edit"
                        onClick={() => {
                            const { id, relation, isActive } = rowData;


                            // console.log({ id, shiftType, startTime: startTimeDayjs, endTime: endTimeDayjs, isActive }, "EditOutlined<<<<<<<<,");

                            if (isActive) {
                                editRealtion({ id, relation, isActive });
                            }
                        }}
                        style={{ color: '#1890ff', fontSize: '14px',display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }}
                    />
                    <Divider type="vertical" />
                    <Popconfirm onConfirm={e => { deleteRelations(rowData); }}
                        title={
                            rowData.isActive
                                ? 'Are you sure to Deactivate Relation ?'
                                : 'Are you sure to Activate Relation ?'
                        }
                    >
                        <Switch size="default"
                         disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Delete)}
                            className={rowData.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                            checkedChildren={<RightSquareOutlined type="check" />}
                            unCheckedChildren={<RightSquareOutlined type="close" />}
                            checked={rowData.isActive}
                        />
                    </Popconfirm>
                </span>
            )
        }
    ];

    return (
        <>
            <PageContainer title='Relations' breadcrumbRender={false}
                extra={
                    <Space>
                        <Button
                            type="primary"  disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)}
                            icon={<PlusOutlined />}
                            onClick={openForm}
                        >
                            Add
                        </Button>
                        <Button  style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>
                            Get Excel
                        </Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    size={"small"}
                    pagination={{
                        pageSize:20,
                        onChange(current, pageSize) {
                            setPage(current);
                            setPageSize(pageSize);
                        },
                    }}
                    rowKey="id"
                />
            </PageContainer>

            <Modal
                title={isUpdate ? "Update Relations" : "Create Relations"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width={window.innerWidth > 768 ? "60%" : "100%"}
            >
                <RelationForm
                    key={isUpdate ? selectedStyleData?.id : 'new-Relations'}
                    updateDetails={updateRelationsDetails}
                    isUpdate={isUpdate}
                    relationsData={selectedStyleData || {}}
                    closeForm={closeModal}
                    getAllRelations={getAllRelations}
                />
            </Modal>
        </>
    );
};

export default RelationsGrid;
