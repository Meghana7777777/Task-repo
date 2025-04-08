import { EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Table } from "antd";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DeptWiseWorkerStrengthReport() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const empService = new EmployeeOnboardingService();

    useEffect(() => {
        getDeptWiseWorkerStrengthForHr();
    }, []);

    function getDeptWiseWorkerStrengthForHr() {
        empService.getDeptWiseWorkerStrengthForHr().then((res) => {
            console.log(res.data);
            if (res.status) {
                setData(res.data);
                generateColumns(res.data);
            } else {
                setData([]);
            }
        });
    }

    // Dynamically create columns and remove those with all 0s
    function generateColumns(data) {
        if (!data.length) return;

        // Get all unique department names from the first record
        const deptNames = Object.keys(data[0]).filter((key) => key !== "unitName");

        // Identify columns with all 0s
        const validDepts = deptNames.filter((dept) => {
            return data.some((row) => row[dept] !== 0);
        });

        // Define base columns
        const dynamicColumns = [
            {
                title: "S No",
                render: (_, __, index) => (page - 1) * pageSize + index + 1,
                fixed: "left",
                width: 70,
            },
            {
                title: "Unit Name",
                dataIndex: "unitName",
                fixed: "left",
                width: 150,
                render:(val,rec)=>{
                    return val ? val :'NOT ASSIGNED'
                }   
            },
            // Generate columns only for departments that have values > 0
            ...validDepts.map((dept) => ({
                title: dept,
                dataIndex: dept,
                align: "center",
                width: 100,
            })),
        ];

        setColumns(dynamicColumns);
    }

    function exportToExcel() {
        if (!data.length) return;
        const deptNames = Object.keys(data[0]).filter((key) => key !== "unitName");

        const validDepts = deptNames.filter((dept) =>
            data.some((row) => row[dept] !== 0)
        );

        // Prepare filtered data with valid columns
        const filteredData = data.map((row) => {
            const newRow = { unitName: row.unitName ? row.unitName : 'NOT ASSIGNED' };
            validDepts.forEach((dept) => {
                newRow[dept] = row[dept];
            });
            return newRow;
        });

        // Generate worksheet and workbook
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DeptWiseWorkerStrength");

        // Export the Excel file
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(dataBlob, "DeptWiseWorkerStrengthReport.xlsx");
    }

    return (
        <>
            <Card
                title="Department Wise Worker Strength Report"
                extra={
                    <Button
                        onClick={exportToExcel}
                        style={{
                            border: "1px dashed #22f534",
                            color: "green",
                            fontWeight: "bold",
                        }}
                        type="dashed"
                    >
                        Get Excel
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                        pageSize: pageSize,
                    }}
                    scroll={{ x: "max-content" }}
                    rowKey="unitName"
                    bordered
                />
            </Card>
        </>
    );
}
