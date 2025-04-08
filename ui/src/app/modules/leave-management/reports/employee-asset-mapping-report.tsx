import {
    AssetSharedService,
    EmpAssetMappingSharedService,
    EmployeeOnboardingService,
} from "@hrexpert/shared-services";
import { Button, Card, Table } from "antd";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const EmpAssetMappingMisReport = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [allAssets, setAllAssets] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const assetSharedService = new AssetSharedService();
    const assetMappingtoEmp = new EmpAssetMappingSharedService();
    const employeeService = new EmployeeOnboardingService();

    useEffect(() => {
        getAssetsAndMappings();
        getActiveEmployees();
    }, []);

    const getActiveEmployees = async () => {
        const response = await employeeService.getActiveEmployeeList();
        if (response.status) {
            setEmployees(response.data);
            return response.data;
        } else {
            setEmployees([]);
            return [];
        }
    };

    const getAssetsAndMappings = async () => {
        const assetResponse = await assetSharedService.getAssets();
        const mappingResponse = await assetMappingtoEmp.getAllEmpAssets();
        const employeeList = await getActiveEmployees();
        if (assetResponse.status && mappingResponse.status) {
            const assetList = assetResponse.data;
            const mappingList = mappingResponse.data;

            const employeeMap = new Map(
                employeeList.map((emp: any) => [emp.employeeId, emp.employeeName])
            );

            setAllAssets(assetList);
            const processedData = mappingList.map((mapping: any) => {
                const assetMap = Object.fromEntries(
                    assetList.map((asset: any) => [
                        asset.asset,
                        mapping.assetIds.includes(String(asset.assetId)) ? "Yes" : "No",
                    ])
                );
                return {
                    employeeId: employeeMap.get(mapping.employeeId) || "-",
                    employeeAssetId: mapping.employeeAssetId,
                    issuedDate: mapping.issuedDate,
                    returnDate: mapping.returnDate,
                    assetStatus: mapping.assetStatus,
                    remarks: mapping.remarks || "-",
                    isActive: mapping.isActive ? "Yes" : "No",
                    ...assetMap,
                };
            });

            setData(processedData);
            generateColumns(assetList);
        } else {
            setData([]);
            setColumns([]);
        }
    };

    const generateColumns = (assets: any[]) => {
        const snoColumn = {
            title: "S No",
            render: (_: any, __: any, index: number) =>
                (page - 1) * pageSize + index + 1,
            fixed: "left",
            width: 70,
        };

        const baseColumns = [
            {
                title: "Employee ID",
                dataIndex: "employeeId",
                width: 100,
            },
        ];

        const assetColumns = assets.map((asset: any) => ({
            title: asset.asset,
            dataIndex: asset.asset,
            width: 120,
        }));

        const postAssetColumns = [
            {
                title: "Status",
                dataIndex: "assetStatus",
                width: 100,
            },
            {
                title: "Remarks",
                dataIndex: "remarks",
                width: 150,
            },
        ];

        setColumns([
            snoColumn,
            ...baseColumns,
            ...assetColumns,
            ...postAssetColumns,
        ]);
    };

    const exportToExcel = () => {
        if (!data.length) return;

        const exportData = data.map((row) => {
            const newRow: any = {};
            Object.entries(row).forEach(([key, value]) => {
                newRow[key] = value ?? "";
            });
            return newRow;
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "EmpAssetMappingReport");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(dataBlob, "EmpAssetMappingReport.xlsx");
    };

    const getAssetSummaryCounts = () => {
        const summary: any = {};
        allAssets.forEach((asset: any) => {
            const assetKey = asset.asset;
            const count = data.reduce((acc, row) => {
                return row[assetKey] === "Yes" ? acc + 1 : acc;
            }, 0);
            summary[assetKey] = count;
        });
        return summary;
    };

    return (
        <Card
            title="Employee Asset Mapping Report"
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
                    onChange: (current) => setPage(current),
                    pageSize: pageSize,
                }}
                scroll={{ x: "max-content" }}
                rowKey="employeeAssetId"
                bordered
                summary={() => {
                    const assetCounts = getAssetSummaryCounts();

                    const assetStartIndex = columns.findIndex((col: any) =>
                        allAssets.some((asset: any) => asset.asset === col.dataIndex)
                    );

                    return (
                        <Table.Summary fixed="bottom">
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={assetStartIndex}>
                                    <strong>Total Assigned Assets</strong>
                                </Table.Summary.Cell>

                                {allAssets.map((asset: any, idx: number) => (
                                    <Table.Summary.Cell
                                        key={`asset-${asset.asset}`}
                                        index={assetStartIndex + idx}
                                    >
                                        <strong>{assetCounts[asset.asset] || 0}</strong>
                                    </Table.Summary.Cell>
                                ))}

                                {columns.length - (assetStartIndex + allAssets.length) > 0 &&
                                    columns
                                        .slice(assetStartIndex + allAssets.length)
                                        .map((_, idx) => (
                                            <Table.Summary.Cell
                                                key={`post-${idx}`}
                                                index={assetStartIndex + allAssets.length + idx}
                                            />
                                        ))}
                            </Table.Summary.Row>
                        </Table.Summary>
                    );
                }}
            />
        </Card>
    );
};

export default EmpAssetMappingMisReport;
