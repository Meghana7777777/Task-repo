import { FileExcelFilled, UploadOutlined } from "@ant-design/icons";
import { ApplyForLeaveStatusEnum } from "@hrexpert/shared-models";
import { ApplForLeavesSharedService, LeavePolicyService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, message, Row, Spin, Table, Upload, UploadFile } from "antd";
import { Excel } from "antd-table-saveas-excel";
import { IExcelColumn } from "antd-table-saveas-excel/app";
import { ColumnsType } from "antd/es/table";
import Papa from 'papaparse';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';

export const ApplyForLeavesExcelUpload = () => {
  const [page, setPage] = React.useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [data, setData] = useState([])
  const service = new ApplForLeavesSharedService()
  const leavePolicyService = new LeavePolicyService()
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [employeeData, setEmployeeData] = useState([]);
  const [leaveAllocations, setLeaveAllocations] = useState<any[]>([]);
  const [typesOfLeaveData, setTypesOfLeavesData] = useState<any[]>([]);
  const [typeIdData, setTypeIdData] = useState<any[]>([]);
  const [leaveTypeGroupMapping, setLeaveTypeGroupMapping] = useState<any[]>([]);

  useEffect(() => {
    getActiveEmployeesById();
    getAllLeaveAllocationsData();
    getAllTypesOfLeavesData();
    getLeaveTypeGroupMapping();
  }, [])

  // console.log(employeeData,"employeeData")
  // useEffect(() => {
  //   const abced = data.map((i) => {
  //     console.log(typesOfLeaveData, "typesOfLeaveData")
  //     const gh = typesOfLeaveData?.find(t => {
  //       return t.leaveCode === i['Type Of Leave'];
  //     });
  //     console.log(gh,":::::::::")
  //     return {
  //       ...i,
  //       tlId: gh?.leaveTypeId || null
  //     };
  //   }).filter((r) => r.tlId !== null);
  //   console.log(abced,":::0oiu")
  //   setTypeIdData(abced);
  // }, [data, typesOfLeaveData]);

  const getLeaveTypeGroupMapping = () => {
    try {
      leavePolicyService.getLeaveTypeGroupMapping().then((res) => {
        if (res.status) {
          setLeaveTypeGroupMapping(res.data)
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const getAllTypesOfLeavesData = () => {
    try {
      service.getAllTypesOfLeavesData().then((res) => {
        if (res.status) {
          setTypesOfLeavesData(res.data)
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const getActiveEmployeesById = () => {
    try {
      service.getActiveEmployeesById().then((res) => {
        if (res.status) {
          setEmployeeData(res.data.data)
        }
      })
    } catch (err) {
      console.log(err);
    }
  }
  const getAllLeaveAllocationsData = () => {
    try {
      service.getAllLeaveAllocationsData().then((res) => {
        if (res.status) {
          setLeaveAllocations(res.data)
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const mappingData = () => {
    const aaa = employeeData.flatMap((e) => {
      return data
        .filter((d) => d["Employee Code"] === Number(e.employeeCode))
        .map((f) => {
          return {
            ...f,
            empId: e.empId,
            leaveGroup:e.leaveGroup,
            noOfDays: Number(f["No Of Days"]) || 0,
          };
        });
    });
    const mapLeaveGroupsWithTypeId = leaveTypeGroupMapping.filter(
      (l) => aaa.some((item) => l.leaveGroupId === item.leaveGroup)
    );
    const ccc = aaa.map((a) => {
      const ddd = mapLeaveGroupsWithTypeId.find(
        (d) => d.leaveCode === a['Type Of Leave']
      );
      return {
        ...a,
        tlId: ddd?.leaveTypeId,
      }
    })

    const eee = ccc.map((b) => {
      const fff = leaveAllocations.find(
        (l) => l.employeeId === b.empId && l.leaveTypeId === b.tlId
      );
      return {
        ...b,
        availbleLeaves: fff?.available || 0,
        leavesUsed: fff?.leavesUsed || 0,
        leavesAlloted: fff?.leavesAlloted || 0
      };
    });


    return eee;
  };

  const calculateTotalNoDays = () => {
    const orginalDataObj = mappingData();
    let exceededEmployees = []
    for (const record of orginalDataObj) {
      const { "Employee Code": empCode, empId, "Type Of Leave": leaveType, tlId, availbleLeaves, noOfDays } = record;
      const available = parseFloat(availbleLeaves);
      const daysRequested = parseFloat(noOfDays);
      if (daysRequested > available) {
        exceededEmployees.push({ empCode, empId })
      } else {
        console.log(
          `✅ Record Valid: Employee Code:${empCode}, empId:${empId}, Leave Type:"${leaveType}", Type of Leave Id:${tlId}, No. of Days:${daysRequested}, Available Leaves:${available}`
        );
      }
    }
    if (exceededEmployees.length > 0) {
      message.error("Leaves Exceed for some employees.");
      console.log("Exceeded Employees:", exceededEmployees);
      return false;
    }
    return true;
  };

  // const updateApplyLeaveStatusApprovedBulk = (req: any) => {
  //   console.log(req, "req");
  //   service.updateApplyLeaveStatusApprovedBulk(req).then((res) => {
  //     if (res.status) {
  //       message.success(res.internalMessage)
  //     }
  //   })
  // }

  const saveExcelData = async () => {
    try {
      const orginalDataObj = mappingData();
      let exceededEmployees = [];
      for (const record of orginalDataObj) {
        const { "Date": Date, "Employee Code": empCode, "Leave Address": leaveAddress, "Leave Reason": leaveReason, empId, "Type Of Leave": leaveType, tlId, availbleLeaves, noOfDays, employeeName, leavesAlloted, leavesUsed } = record;
        const available = parseFloat(availbleLeaves);
        const daysRequested = parseFloat(noOfDays);
        if (daysRequested > available) {
          exceededEmployees.push({ Date, empCode, leaveAddress, leaveReason, empId, leaveType, tlId, availbleLeaves, noOfDays, employeeName, leavesAlloted, leavesUsed });
        } 
      }
      setLoading(true);
      const validData = orginalDataObj.filter(
        (item) => !exceededEmployees.some((exceed) => exceed.empCode === item["Employee Code"])
      );

      const applyForLeavesId = validData.map((_, index) => index + 3);
      const status = ApplyForLeaveStatusEnum.APPROVED;
      const employeeIds = validData.map((item) => String(item.empId));
      const leaveTypeIds = validData.map((item) => String(item.tlId));
      const noOfDays = validData.map((item) => String(Number(item.noOfDays).toFixed(1)));

      // const updateReq = {
      //   applyForLeavesId,
      //   status,
      //   employeeIds,
      //   leaveTypeIds,
      //   noOfDays,
      // };

      if (exceededEmployees.length > 0) {
        service.saveExceededLeaveExcelData(exceededEmployees).then((res) => {
        }).catch((error) => {
          console.error("Error saving exceeded employees:", error);
        });
      }
      await service.saveBulkLeaveExcel(validData).then((res) => {
        setLoading(false);
        if (res.status) {
          form.resetFields();
          message.success("Leaves Applied Successfully");
          if (exceededEmployees.length > 0) {
            navigate('/exceeded-leaves')
          } else {
            navigate('/apply-for-leaves-excel-upload')
          }
          onReset();
        } else {
          message.error("Error While Applying Leaves");
        }
      }).finally(() => {
        setLoading(false);
      });

    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };


  const importExcel = (file) => {
    const data = new Uint8Array(file);
    const wb = XLSX.read(data, { type: 'array', cellDates: true });
    let sheet = [];
    for (const Sheet in wb.Sheets) {
      if (wb.Sheets.hasOwnProperty(Sheet)) {
        let jsonSheet = XLSX.utils.sheet_to_json(wb.Sheets[Sheet], { raw: true, header: 1 });
        jsonSheet = jsonSheet
          .map((row: any) =>
            row.map((cell) => {
              if (cell instanceof Date) {
                cell.setDate(cell.getDate() + 1)
                return cell.toLocaleDateString('en-GB').replace(/\//g, '-');
              }
              return cell ? cell.toString() : cell;
            })
          )
          .filter((row) => row.some((cell) => cell !== null && cell !== ""));

        sheet.push(jsonSheet);
      }
    }
    return sheet;
  };

  const handleFileChange = ({ file, fileList }) => {
    const newFile = file.originFileObj;
    setFileList(fileList);
    const employeeCodeToIdMap = Object.fromEntries(
      employeeData.map((i) => [Number(i.employeeCode), i.empId])
    );
    if (newFile && newFile.type === "text/csv") {
      setSelectedFile(newFile);
      Papa.parse(newFile, {
        header: true,
        complete: (result) => {
          const mappedEmployeeId = result.data.map((row) => {
            const employeeCode = Number(row["Employee Code"]);
            return {
              ...row,
              "Employee Id": employeeCodeToIdMap[employeeCode] || null,
            };
          });
          setData(mappedEmployeeId);
        },
        skipEmptyLines: true,
      });
    } else if (
      newFile &&
      newFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setSelectedFile(newFile);
      const reader = new FileReader();
      reader.readAsArrayBuffer(newFile);
      reader.onload = () => {
        const csvData = importExcel(reader.result);
        const output = csvData[0].slice(1).map((row) => {
          const employeeCode = Number(row[0]);
          return {
            "Employee Code": employeeCode,
            "Type Of Leave": row[1],
            "Date": row[2],
            "No Of Days": row[3],
            "Leave Reason": row[4],
            "Leave Address": row[5],
          };
        });
        setData(output);
      };
    } else {
      message.error("Please select a valid file.");
      setSelectedFile(null);
      setFileList([]);
    }
  };

  const handleExport = (e: any) => {
    e.preventDefault();
    const currentDate = new Date()
      .toISOString()
      .slice(0, 10)
      .split("-")
      .join("/");
    const excel = new Excel();
    excel.addSheet("Sheet1");
    excel.addColumns(sampleExcelFormatColumns);
    excel.addDataSource(sampleLeaveExcelFormat, { str2num: false });
    excel.saveAs(`apply-leaves-${currentDate}.xlsx`);
  }

  const dateFormatToSendIntoSampleExcelFormat = (jj) => {
    const [day, month, year] = jj.split('-');
    return `${day}-${month}-${year}`;
  };

  const sampleLeaveExcelFormat = [
    {
      employeeCode: "Employee Code",
      TypeOfLeave: "CL/ CO/ EL",
      // date: dateFormatToSendIntoSampleExcelFormat("29-11-2024"),
      date:"DD-MM-YYYY",
      noOfDays: '1',
      leaveReason: 'Festival/Sick',
      leaveAddress: "Address"
    },
  ];

  let sampleExcelFormatColumns: IExcelColumn[] = [
    {
      title: 'Employee Code',
      dataIndex: 'employeeCode',
    },
    {
      title: 'Type Of Leave',
      dataIndex: 'TypeOfLeave',
      __cellType__: "TypeString",
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text, record) => record.date ? dateFormatToSendIntoSampleExcelFormat(record.date) : '-'
    },
    {
      title: 'No of Days',
      dataIndex: 'noOfDays',
    },
    {
      title: 'Leave Reason',
      dataIndex: 'leaveReason',
      __cellType__: "TypeString",
    },
    {
      title: 'Leave Address',
      dataIndex: 'leaveAddress',
      __cellType__: "TypeString",
    },
  ];

  const onReset = () => {
    form.resetFields();
    setData([]);
    setSelectedFile(null);
    setFileList([]);
  };

  const columns: ColumnsType<any> = [
    {
      title: 'S No',
      render: (text, object, index) => (page - 1) * 10 + (index + 1),
      align: "center"
    },
    {
      title: "Employee Code",
      dataIndex: "Employee Code",
      key: "employeeCode",
      align: "center",
    },
    {
      title: "Type Of Leave",
      dataIndex: "Type Of Leave",
      key: "typeOfLeave",
      align: "center",
    },
    {
      title: "From Date",
      dataIndex: "Date",
      key: "Date",
      align: "center",
    },
    {
      title: "To Date",
      dataIndex: "Date",
      key: "Date",
      align: "center",
    },
    {
      title: "No Of Days",
      dataIndex: "No Of Days",
      key: "noOfDays",
      align: "center",
    },
    {
      title: "Leave Reason",
      dataIndex: "Leave Reason",
      key: "leaveReason",
      align: "center",
    },
    {
      title: "Leave Address",
      dataIndex: "Leave Address",
      key: "leaveAddress",
      align: "center",
    },
  ];

  return (
    <Card title="Apply Leaves" extra={
      <>
        <Link to="/apply-for-leaves-mannual-form">
          <Button className="panel_button" style={{ color: "blue", fontWeight: "bold", borderColor: "blue" }} type="dashed"> Create Mannual Leave </Button>
        </Link> &nbsp;
        <Link to="/exceeded-leaves">
          <Button className="panel_button" style={{ color: "red", fontWeight: "bold", borderColor: "red" }} type="dashed">View Exceeded Leaves </Button>
        </Link>

      </>
    }>
      <Spin spinning={loading}>
        <Form>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item>
                <Upload
                  fileList={fileList}
                  onChange={handleFileChange}
                  showUploadList={true}
                  accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                >
                  <Button disabled={fileList.length >= 1} icon={<UploadOutlined />}>Click to Upload</Button><br />
                  <label style={{ color: 'blue', whiteSpace: 'nowrap' }}>Only CSV & Excel files are allowed</label>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Button type="primary" onClick={saveExcelData} disabled={!selectedFile}>Upload</Button>&nbsp;&nbsp;
              {fileList.length >= 1 && (
                <>
                  <Button type="primary" danger onClick={onReset}>Reset</Button>
                </>
              )}
            </Col>
            <Button type="default" style={{ color: 'green' }} onClick={handleExport} icon={<FileExcelFilled />}>
              Sample Format
            </Button>
          </Row>
        </Form>

        {data.length > 0 ? (
          <Table className="custom-table-wrapper" pagination={false} bordered dataSource={data} columns={columns} rowKey="Employee Code" />
        ) : (
          <div>No data available</div>
        )}

      </Spin>
    </Card>
  )

}

export default ApplyForLeavesExcelUpload