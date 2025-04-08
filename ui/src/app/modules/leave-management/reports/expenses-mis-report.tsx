import { EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Table } from "antd";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExpensesMisReport() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const empService = new EmployeeOnboardingService();

    useEffect(() => {
        getExpansesMisReport();
        console.log('---hi ')
    }, []);

    function getExpansesMisReport() {
        const req ={

        }
        empService.getExpansesMisReport(req).then((res) => {
            console.log(res);
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
        const expenseTypes = Object.keys(data[0]).filter((key) => key !== "branchName");

        // Identify columns with all 0s
        const validExpences = expenseTypes.filter((type) => {
            return data.some((row) => row[type] !== 0);
        });

        // Define base columns
        const dynamicColumns = [
            // Generate columns only for departments that have values > 0
            ...validExpences.map((type) => ({
                title: type,
                dataIndex: type,
                align: "center",
                width: 100,
            })),
        ];

        setColumns(dynamicColumns);
    }


    const columnSkeleton :any=[
        {
            title: "S No",
            render: (_, __, index) => (page - 1) * pageSize + index + 1,
            fixed: "left",
            width: 70,
        },
        {
            title: "Branch Name",
            dataIndex: "branchName",
            fixed: "left",
            width: 150,
        },
        ...columns
    ]

    function exportToExcel() {
        if (!data.length) return;

        // Get all unique expense types except "branchName"
        const expenseTypes = Object.keys(data[0]).filter((key) => key !== "branchName");

        // Filter valid expense types
        const validExpenses = expenseTypes.filter((type) =>
            data.some((row) => parseFloat(row[type]) !== 0)
        );

        // Prepare filtered data with valid columns
        const filteredData = data.map((row) => {
            const newRow = { branchName: row.branchName || "NOT ASSIGNED" };
            validExpenses.forEach((type) => {
                newRow[type] = row[type] || "0.00";
            });
            return newRow;
        });

        // Generate worksheet and workbook
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ExpensesMisReport");

        // Export the Excel file
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(dataBlob, "ExpensesMisReport.xlsx");
    }

    return (
        <>
              <Card
                title="Expenses MIS Report"
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
                    columns={columnSkeleton}
                    dataSource={data}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                        pageSize: pageSize,
                    }}
                    scroll={{ x: "max-content" }}
                    rowKey="branchName"
                    bordered
                />
            </Card>
        </>
    )
}