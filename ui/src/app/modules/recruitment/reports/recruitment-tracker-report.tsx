import { FileExcelOutlined, UndoOutlined } from '@ant-design/icons';
import { CompanySharedService, RecruitmentServiceSharedService } from '@hrexpert/shared-services';
import { Button, Col, Form, message, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';

const RecruitmentTrackerReport = () => {
  const [form] = Form.useForm();
  const [companyRecords, setCompanyRecords] = useState<any>([]);
  const recruitmentSharedservice = new RecruitmentServiceSharedService();
  const companyService = new CompanySharedService();
  const [data, setData] = useState<any[]>([])
  const [description, setDescription] = useState<any>([]);
  const Option = Select;

  useEffect(() => {
    getActiveCompany();
    getAllRequirements()
    getRecruitmentTrackerReport()
  }, []);

  const getActiveCompany = () => {
    try {
      companyService.getActiveCompany().then((res) => {
        if (res.status) {
          setCompanyRecords(res.data);
        } else {
          message.error('Failed to retrieve company');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllRequirements = () => {
    try {
      recruitmentSharedservice.getRecruitment().then((res) => {
        if (res.status) {
          setDescription(res.data)
        }
        else {
          message.error("Failed to retrieve branches");
        }
      })
    } catch (error) {
      console.log(error);

    }
  };

  const getRecruitmentTrackerReport = (val?: any) => {
    try {
      recruitmentSharedservice.getRecruitmentTrackerReport(val).then((res) => {
        if (res.status) {
          setData(res.data);
        } else {
          message.error('Failed to retrieve data');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const processData = () => {
    const result = [];
    let serial = 1;

    data.forEach((job, index) => {
      const profiles = JSON.parse(job.Proflie || "[]");
      const hasProfiles = profiles.length > 0;
      const rowCount = hasProfiles ? profiles.length : 1;

      for (let i = 0; i < rowCount; i++) {
        const profile = profiles[i] || {};

        result.push({
          key: `${index}-${i}`,
          serialNo: serial,
          client: job.companyName,
          jobRole: job.jobRoleName,
          requiredResources: job.resourceRequired,
          candidateName: hasProfiles ? profile.candidateName : "NO DATA FOUND",
          interviewStatus: hasProfiles ? profile.interviewStatus : null,
          totalProfileAssigned: hasProfiles ? job.totalProfileAssigned : null,
          totalRejected: hasProfiles ? job.totalRejected : null,
          toBeInterviewed: hasProfiles ? job.toBeInterviewed : null,
          totalSelected: hasProfiles ? job.totalSelected : null,
          rowSpan: i === 0 ? rowCount : 0,
          isNoData: !hasProfiles,
        });
      }

      serial++;
    });

    return result;
  };

  const columns: ColumnsType<any> = [
    {
      title: "S.No",
      dataIndex: "serialNo",
      align: 'center',
      render: (_, row) => ({
        children: row.serialNo,
        props: { rowSpan: row.rowSpan },
      }),
    },
    {
      title: "Client",
      dataIndex: "client",
      align: 'center',
      render: (_, row) => ({
        children: row.client,
        props: { rowSpan: row.rowSpan },
      }),
    },
    {
      title: "Job Role",
      dataIndex: "jobRole",
      align: 'center',
      render: (_, row) => ({
        children: row.jobRole,
        props: { rowSpan: row.rowSpan },
      }),
    },
    {
      title: "Required Resources",
      dataIndex: "requiredResources",
      align: 'center',
      render: (_, row) => ({
        children: row.requiredResources,
        props: { rowSpan: row.rowSpan },
      }),
    },
    {
      title: "Profile",
      children: [
        {
          title: "Candidate Name",
          dataIndex: "candidateName",
          align: 'center',
          render: (_, row) =>
            row.isNoData
              ? { children: row.candidateName, props: { colSpan: 6, style: { textAlign: "center", color: "red" } } }
              : row.candidateName,
        },
        {
          title: "Interview Status",
          dataIndex: "interviewStatus",
          align: 'center',
          render: (_, row) =>
            row.isNoData ? { children: null, props: { colSpan: 0 } } : row.interviewStatus,
        },
      ],
    },
    {
      title: "Total Profiles Assigned",
      dataIndex: "totalProfileAssigned",
      align: 'center',
      render: (_, row) => ({
        children: row.totalProfileAssigned,
        props: { rowSpan: row.rowSpan },
      }),
    },
    {
      title: "Total Rejected",
      dataIndex: "totalRejected",
      align: 'center',
      render: (_, row) => ({
        children: row.totalRejected,
        props: { rowSpan: row.rowSpan },
      }),
    },
    {
      title: "To Be Interviewed",
      dataIndex: "toBeInterviewed",
      align: 'center',
      render: (_, row) => ({
        children: row.toBeInterviewed,
        props: { rowSpan: row.rowSpan },
      }),
    },
    {
      title: "Total Selected",
      dataIndex: "totalSelected",
      align: 'center',
      render: (_, row) => ({
        children: row.totalSelected,
        props: { rowSpan: row.rowSpan },
      }),
    },

  ];

  const Reset = () => {
    form.resetFields();
  }

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tracker Report");
    const table = document.querySelector(".ant-table-content table") as HTMLTableElement;
    if (!table) {
      console.error("Table not found!");
      return;
    }
    const rec: Record<string, boolean> = {};
    const rows = Array.from(table.querySelectorAll("tr"));
  
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      if (rowIndex === 2) continue
      const rowElement = rows[rowIndex];
      const cells = Array.from(rowElement.children) as HTMLTableCellElement[];
      const row = worksheet.getRow(rowIndex + 1 > 2 ? rowIndex : rowIndex + 1);
      let colIndex = 1;
      for (const cell of cells) {
        while (rec[`${row.number}-${colIndex}`]) colIndex++;
        const value = cell.innerText.trim();
        const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
        const rowspan = parseInt(cell.getAttribute("rowspan") || "1", 10);
        const excelCell = row.getCell(colIndex);
        excelCell.value = value;
        excelCell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        excelCell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (row.number === 1 || row.number === 2) {
          excelCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "006400" },
          };
          excelCell.font = {
            color: { argb: "FFFFFF" },
            bold: true,
          };
        }
        for (let r = 0; r < rowspan; r++) {
          for (let c = 0; c < colspan; c++) {
            rec[`${row.number + r}-${colIndex + c}`] = true;
          }
        }
        if (rowspan > 1 || colspan > 1) {
          worksheet.mergeCells(
            row.number,
            colIndex,
            row.number + rowspan - 1,
            colIndex + colspan - 1
          );
        }
        colIndex += colspan;
      }
    }
    worksheet.columns.forEach((col) => {
      col.width = 20;
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Tracker_Report.xlsx");
  };

  // const handleExportExcel = async () => {
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Tracker Report");
  //   const table = document.querySelector(".ant-table-content table") as HTMLTableElement;
  //   if (!table) {
  //     console.error("Table not found!");
  //     return;
  //   }
  //   const rec: Record<string, boolean> = {};
  //   const rows = Array.from(table.querySelectorAll("tr"));
  //   for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
  //     const rowElement = rows[rowIndex];
  //     const cells = Array.from(rowElement.children) as HTMLTableCellElement[];
  //     const row = worksheet.getRow(rowIndex + 1);
  //     let colIndex = 1;
  //     for (const cell of cells) {
  //       while (rec[`${rowIndex + 1}-${colIndex}`]) colIndex++;
  //       const value = cell.innerText.trim();
  //       const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
  //       const rowspan = parseInt(cell.getAttribute("rowspan") || "1", 10);
  //       row.getCell(colIndex).value = value;
  //       row.getCell(colIndex).alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  //       row.getCell(colIndex).border = {
  //         top: { style: "thin" },
  //         left: { style: "thin" },
  //         bottom: { style: "thin" },
  //         right: { style: "thin" },
  //       };
  //       for (let r = 0; r < rowspan; r++) {
  //         for (let c = 0; c < colspan; c++) {
  //           rec[`${rowIndex + 1 + r}-${colIndex + c}`] = true;
  //         }
  //       }
  //       if (rowspan > 1 || colspan > 1) {
  //         worksheet.mergeCells(
  //           rowIndex + 1,
  //           colIndex,
  //           rowIndex + rowspan,
  //           colIndex + colspan - 1
  //         );
  //       }
  //       colIndex += colspan
  //     }
  //   }
  //   worksheet.columns.forEach((col) => {
  //     col.width = 20
  //   });
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   saveAs(new Blob([buffer]), "Tracker_Report.xlsx");
  // };

  return (
    <div>
      <Form layout="vertical" form={form} onFinish={getRecruitmentTrackerReport}>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item
              label="Company"
              name="company"
              rules={[{ required: false, message: 'Please Select Company' }]}
            >
              <Select
                showSearch
                placeholder="Select Company"
                allowClear
                optionFilterProp="children"
              >
                {companyRecords.map((comp) => (
                  <Option key={comp.id} value={comp.id}>
                    {comp.companyName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4} xl={6}>
            <Form.Item
              name="jobRole"
              label="Job Description"
              rules={[{ required: false, message: 'Job Role is required' }]}
            >
              <Select
                showSearch
                allowClear
                placeholder="Select Roles"
                optionFilterProp="children"
                dropdownMatchSelectWidth={false}
              >
                {description.map((rec) => (
                  <Option value={rec.jobRole} key={rec.jobRole}>
                    {rec.name} - {rec.jobDescription}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: '23px' }}>
            <Button type="primary" htmlType='submit' >
              Submit
            </Button>
          </Col>

          <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: '23px' }}>
            <Button icon={<UndoOutlined />} onClick={Reset} type="dashed" danger>
              Reset
            </Button>
          </Col>

          {data && (
            <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: '23px' }}>
              <Button
                icon={<FileExcelOutlined />}
                style={{
                  border: '1px dashed #22f534',
                  color: 'green',
                  fontWeight: 'bold',
                }}
                type="dashed"
                onClick={handleExportExcel}
              >
                Get Excel
              </Button>
            </Col>
          )}
        </Row>
      </Form>

      <Table
        columns={columns}
        dataSource={processData()}
        bordered
        pagination={{ pageSize: 20 }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );

};

export default RecruitmentTrackerReport;
