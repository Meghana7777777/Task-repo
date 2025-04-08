import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { configVariables, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, message, Modal, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const EmpResignationView = ({ data }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModelVisible, setIsModelVisible] = useState(false);
  const baseUrl = configVariables.RESIGNATION_PROOFS_URL

  const navigate = useNavigate();
  const service = new EmployeeOnboardingService();

  useEffect(() => {
    setTableData(data);
    getEmpResigProofs(data);
  }, [data]);

  const onHandleImage = (value)=>{
    setSelectedImage(`${baseUrl}${value}`)
    setIsModelVisible(true);
  }


  const getEmpResigProofs = (req: any) => {
    try {
      service.getEmpResignationProofs(req).then((res) => {
        if (res.status) {
          setTableData(res.data)
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

  console.log()

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Employee Code",
      dataIndex: "empCode",
      key: "empCode",
    },
    {
      title: "Employee Name",
      dataIndex: "empName",
      key: "empName",
    },
    {
      title: "Image",
      dataIndex: "fileName",
      key: "fileName",
      render: (text) => (
        <>
          <Tooltip title="Image View">
            <EyeOutlined
              style={{ cursor: "pointer" }}
              onClick={() => onHandleImage(text)}
            />
          </Tooltip>
          <Modal
            visible={isModelVisible}
            footer={null}
            onCancel={() => setIsModelVisible(false)}
          >
            <img alt={text} style={{ width: "100%" }} src={selectedImage} />
          </Modal>
        </>
      ),
      // render: (text) => (
      //   <>
      //     <img
      //       src={text}
      //       alt={text}
      //       style={{ cursor: "pointer" }}
      //       onClick={() => {onHandleImage(text)}}
      //     />
      //     <Modal
      //       visible={isModelVisible}
      //       footer={null}
      //       onCancel={() => setIsModelVisible(false)}>
      //       <img
      //         alt={text}
      //         style={{ width: '100%' }}
      //         src={selectedImage}>
      //       </img>
      //     </Modal>
      //   </>
      // ),
    },
  ];

  return (
    <PageContainer title='Employee Resignations' breadcrumbRender={false}

      extra={
        <>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/employee-view')}>Add</Button>
        </>
      }
    >

      <Table
        dataSource={tableData}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
    </PageContainer>
  )

};

export default EmpResignationView;
