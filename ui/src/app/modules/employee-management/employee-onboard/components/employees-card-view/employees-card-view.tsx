import { EmployeeViewModel } from '@hrexpert/shared-models';
import { Card, Col, Pagination, Row, Skeleton } from 'antd';
import EmployeeCard from './employee-card';

export interface EmployeeCardViewProps {
    employeeData: EmployeeViewModel[];
    loading: boolean;
    pagination: any;
    onPageChange: any
    getEmployeeData: any
    searchQuery:string
}
export default function EmployeeCardView(props: EmployeeCardViewProps) {    
    return (
        <>
            <Row gutter={[24, 12]}>

                {props.loading ?
                    Array.from({ length: 12 }).map((_, index) => (
                        <Col key={index} xs={24} sm={12} md={12} lg={10} xl={8} xxl={6}>
                            <Card>
                                <Skeleton active title={{ width: '60%' }} avatar paragraph={{ rows: 8, }} />
                            </Card>
                        </Col>
                    )) :
                    props.employeeData.map((rec) => (
                        <Col xs={24} sm={12} md={12} lg={10} xl={8} xxl={6}>
                            <EmployeeCard
                            
                                employeeName={`${rec.firstName} ${rec.lastName || ""}`.trim()}
                                department={rec.departmentName}
                                designation={rec.designationName}
                                mobileNo={rec.mobileNo}
                                gender={rec.gender}
                                employeeCode={rec.employeeCode}
                                employeeId={rec.employeeId}
                                dateOfBirth={rec.dateOfBirth}
                                isActive={rec.isActive}
                                filePath={rec.filePath}
                                fileName={rec.fileName}
                                originalName={rec.originalName}
                                getEmployeeData={props.getEmployeeData}
                                searchQuery={props.searchQuery}
                            />
                        </Col>
                    ))}

            </Row>

        </>
    )
}

