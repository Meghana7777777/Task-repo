import { CalendarFilled, CheckCircleOutlined, CloseCircleOutlined, ContainerFilled, ManOutlined, UploadOutlined, UserAddOutlined, WomanOutlined } from '@ant-design/icons';
import { configVariables, EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Avatar, Badge, Button, Card, Image, message, Modal, Space, Typography, Upload } from 'antd';
import daysjs from 'dayjs';
import React, { useState } from 'react';
import EmployeeDetailedView from '../../pages/employee-view/employee-detailed-view';

export interface EmployeeProps {
    employeeName: string;
    department: string;
    designation: string;
    mobileNo: string;
    gender: string;
    employeeCode: string;
    employeeId: number;
    dateOfBirth: string;
    isActive: boolean;
    filePath: string;
    fileName: string;
    originalName: string;
    getEmployeeData: any;
    searchQuery: string;
}

const EmployeeCard: React.FC<EmployeeProps> = (props) => {
    const { Title, Text, Link } = Typography;
    const [loading, setLoading] = useState(false);
    const employeeService = new EmployeeOnboardingService()
    const genderIcon = (() => {
        const lowerGender = props.gender?.toLowerCase();
        if (['male', 'm'].includes(lowerGender)) {
            return <ManOutlined style={{ fontSize: '15px' }} />;
        } else if (['female', 'f', 'woman', 'women'].includes(lowerGender)) {
            return <WomanOutlined style={{ fontSize: '15px' }} />;
        }
        return null;
    })();
    const dateOfBirth = daysjs(props.dateOfBirth).format('DD/MM/YYYY');
    const [fileList, setFileList] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState(props);
    const config = configVariables

    const getModalViewData = (rowData?: any) => {
        setData(rowData);
        setModalVisible(true);
    };

    const onCancel = () => {
        setModalVisible(false);
    };

    const uploadImageProps = {
        multiple: true,
        onRemove: file => {
            setFileList(prev => {
                const updatedList = prev.filter(rec => rec.uid !== file.uid);
                return updatedList;
            });
        },
        beforeUpload: file => {
            if (!file.name.match(/\.(jpg|png|jpeg)$/)) {
                message.error("Only image files are allowed.");
                return false;
            }
            setFileList(prev => {
                const updatedList = [...prev, file];
                return updatedList;
            });
            return false;
        },
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
        fileList,
        showUploadList: false,
    };

    const employeeImageUpload = (res) => {
        try {
            setLoading(true)
            if (fileList.length > 0) { 
                const formData = new FormData();
                formData.append('id', `${props.employeeId}`);
                fileList.forEach(file => {
                    formData.append('file', file);
                });
                employeeService.employeeImageUpload(formData).then((response) => {
                    if (response) {
                        const uploadedFile = response.data;
                        setData(prev => ({
                            ...prev,
                            filePath: uploadedFile.filePath,
                            fileName: uploadedFile.fileName,
                            originalName: uploadedFile.originalName,
                        }));
                        props.getEmployeeData()
                        message.success("Image uploaded successfully.");
                        setFileList([]);
                        setLoading(false)
                    }
                })
            }
        } catch (err) {
            console.error(err.message);
            message.error("Failed to upload the file.");
        };
    };

    const cancelImage = () => {
        setFileList(null)
        setFileList([])
    }

    const highlightedName = props.employeeName.split(new RegExp(`(${props.searchQuery})`, 'gi')).map((part, index) =>
        part.toLowerCase() === props.searchQuery.toLowerCase() ? (
            <span key={index} className="highlight">
                {part}
            </span>
        ) : (
            part
        )
    );

    return (
        <>
            <Card style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', height: "400px" }} loading={loading} className=''>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        margin: '8px 0',
                    }}
                >
                    <Badge
                        count={props.isActive ? '• Active' : '• Inactive'}
                        style={{
                            backgroundColor: props.isActive ? '#52c41a' : '#f5222d',
                            borderRadius: '8px',
                            padding: '0 8px',
                        }}
                    />
                    {fileList.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button onClick={employeeImageUpload} color="primary" variant="outlined" icon={<CheckCircleOutlined />} />
                            &nbsp;&nbsp;&nbsp;
                            <Button onClick={cancelImage} color='danger' variant="outlined" danger icon={<CloseCircleOutlined />}/>
                        </div>
                    )}
                </div>
                <div style={{ textAlign: 'center', marginTop: 15 }}>
                    {fileList.length > 0 || props.fileName ? (
                        <Image
                            src={fileList.length > 0 ? URL.createObjectURL(fileList[0]) : `${config.IMAGE_UPLOAD_URL}${props.fileName}`}
                            alt="employee-avatar"
                            style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: '2px solid #f0f0f0',
                                cursor: 'pointer',
                            }}
                            preview={true}
                        />
                    ) : (
                        <Upload {...uploadImageProps} accept='.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'>
                            <Avatar
                                size={100}
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    color: '#8c8c8c',
                                    cursor: 'pointer',
                                }}
                                icon={<UserAddOutlined />}
                            />
                        </Upload>
                    )}
                    <br />
                    <Title level={4} style={{ margin: '8px 0' }}>
                        {highlightedName}
                    </Title>

                    <Text type="secondary">{props.designation}</Text>
                </div>
                <Card
                    style={{
                        backgroundColor: '#eeeeee',
                        border: '2px solid #f0f0f0',
                        borderRadius: 8,
                        margin: '16px 0',
                        padding: 8,
                    }}
                >
                    <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>#{props.employeeCode}</Text>
                        <Text strong>
                            <ContainerFilled style={{ fontSize: '15px', marginRight: 4 }} />
                            {props.department}
                        </Text>
                    </Space>
                    <Space direction="vertical" style={{ marginTop: 6 }}>
                        <Space>
                            {genderIcon && genderIcon}
                            <Text strong>{props.gender}</Text>
                        </Space>
                    </Space>
                    <Space
                        style={{ float: 'right', justifyContent: 'space-between', marginTop: 6 }}
                    >
                        <Text strong>
                            <CalendarFilled style={{ fontSize: '15px', marginRight: 4 }} />
                            {dateOfBirth}
                        </Text>
                    </Space>
                </Card>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTop: '1px solid #f0f0f0',
                        paddingTop: 16,
                    }}
                >
                    {props.fileName && (
                        <Upload {...uploadImageProps} accept='.jpg,.JPG,.jpeg,.JPEG,.png,.PNG' showUploadList={false} style={{ marginRight: 'auto' }} >
                            <Button icon={<UploadOutlined />} />
                        </Upload>
                    )}
                    <div style={{ flexGrow: 1, textAlign: 'center' }}>
                        <Link onClick={() => getModalViewData(props)}>
                            View details
                        </Link>
                    </div>
                </div>

            </Card >
            <Modal
                open={modalVisible}
                onCancel={onCancel}
                footer={null}
                width="95%"
                style={{ top: 50, bottom: 50 }}
                key={data.employeeId}
            >
                <EmployeeDetailedView rec={data} />
            </Modal>
        </>
    );
};

export default EmployeeCard;