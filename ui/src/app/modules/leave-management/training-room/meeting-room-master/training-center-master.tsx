import { UndoOutlined, UploadOutlined } from '@ant-design/icons';
import { MeetingRoomReq, RolesEnum } from '@hrexpert/shared-models';
import { TrainingCenterSharedService, UsersService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, Input, message, Row, Select, Typography, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { configVariables } from '../../../../../../../libs/shared-services/src/lib/config';
import { useIAMClientState } from '../../../../common/iam-client-react';
const { Title } = Typography;

export interface MeetingRoomMasterProps {
    meetingRoomData?: MeetingRoomReq | any;
    isUpdate?: boolean;
    closeForm: () => void;
}

export default function TrainingMaster(props: MeetingRoomMasterProps) {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    const { IAMClientAuthContext } = useIAMClientState();
    const existing = JSON.parse(localStorage.getItem('currentUser') || "") || {}
    const service = new TrainingCenterSharedService();
    const { Option } = Select;
    const [data, setData] = useState<any>([]);
    const umsService = new UsersService();

    // useEffect(() => {
    //     getAllOrganizationsDropdown();
    // }, []);

    useEffect(() => {
        if (props.meetingRoomData) {
            form.setFieldsValue(props.meetingRoomData);
            if (props.meetingRoomData.fileName) {
                setFileList([
                    {
                        uid: '-1',
                        name: props.meetingRoomData.fileName,
                        status: 'done',
                        url: `${configVariables.MEETING_ROOM_URL}${props.meetingRoomData.fileName}`,
                    },
                ]);
            }
        }
    }, [props.meetingRoomData, form]);

    // const handleImageUpload = async () => {
    //     try {
    //         if (fileList.length > 0) {
    //             const formData = new FormData();
    //             formData.append('id', `${props.meetingRoomData?.id}`);
    //             fileList.forEach((file) => {
    //                 formData.append('file', file.originFileObj);
    //             });
    //             const response = await service.imageUpload(formData);
    //             if (response && response.data) {
    //                 const uploadedFile = response.data;
    //                 message.success("Image uploaded successfully.");
    //                 return uploadedFile.filePath;
    //             } else {
    //                 message.error("Failed to upload image.");
    //             }
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         message.error("Image upload error.");
    //     }
    // };

    // const getAllOrganizationsDropdown = async () => {
    //     const req = new ApplicationIdReqDto("", 1, 51)
    //     const res = await umsService.getUsersByApplicationId(req);
    //     if (res.status) {
    //         setData(res.data);
    //     } else {
    //         console.error("Failed to fetch meeting rooms.");
    //     }
    // };
    // console.log(data, 'data')
    const createMeetingRoom = async (req: MeetingRoomReq) => {
        try {
            if (existing.userName) {
                req.createdUser = existing.userName;
            } else {
                console.error("User  information is not available.");
            }
            service.createMeetingRoom(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    props.closeForm();
                    form.resetFields();
                    if (fileList.length > 0) {
                        const formData = new FormData();
                        formData.append('id', res.data.id);
                        fileList.forEach((file) => {
                            formData.append('file', file.originFileObj);
                        });
                        service.imageUpload(formData).then((res) => {
                            if (res.status) {
                                message.success(res.internalMessage)
                            }
                        })
                    }
                } else {
                    message.error(res.internalMessage);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const updateMeetingRoom = async (data: any) => {
        try {
            // const imagePath = fileList.length > 0 ? await handleImageUpload() : data.imagePath;
            // data.imagePath = imagePath;

            service.updateMeetingRoom(data).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    props.closeForm();
                    form.resetFields();
                } else {
                    message.error(res.internalMessage);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const saveData = (val: any) => {
        if (props.isUpdate) {
            updateMeetingRoom({ ...val, id: props.meetingRoomData?.id });
        } else {
            createMeetingRoom(val);
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    const handleUploadChange = (info: any) => {
        if (info.fileList.length > 0) {
            setFileList(info.fileList);
        }
    };


    return (
        <Card>
            <Form layout="vertical" scrollToFirstError form={form} onFinish={saveData} initialValues={props.meetingRoomData}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Name" name="meetingRoom" rules={[{ required: true, message: 'Enter Meeting Room Name' }]}>
                            <Input placeholder="Enter Name" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Enter Meeting Room Location' }]}>
                            <Input placeholder="Enter room location" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Capacity" name="capacity" rules={[{ required: true, message: 'Enter Meeting Room capacity' }]}>
                            <Input placeholder="Enter room capacity" />
                        </Form.Item>
                    </Col>

                    <Form.Item name='organizationId' hidden />

                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Room Approver" name="roomApprover" >

                            <Select
                                virtual
                                placeholder="Select Meeting Room"
                                showSearch
                                allowClear
                            >
                                <Option value={RolesEnum.Admin}>{RolesEnum.Admin}</Option>
                                <Option value={RolesEnum.Reception}>{RolesEnum.Reception}</Option>
                                <Option value={RolesEnum.Approver}>{RolesEnum.Approver}</Option>
                                <Option value={RolesEnum.User}>{RolesEnum.User}</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Room Image" name="image">
                            <Upload
                                listType="picture"
                                fileList={fileList}
                                onChange={handleUploadChange}
                                customRequest={({ file, onSuccess }) => {
                                    if (onSuccess) {
                                        setTimeout(() => onSuccess("ok"), 0);
                                    }
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ant-submit-btn"
                                style={{ marginLeft: 20, marginTop: 23 }}
                            >
                                {props.isUpdate ? 'Update' : 'Submit'}
                            </Button>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="default"
                                danger
                                icon={<UndoOutlined />}
                                onClick={onReset}
                                style={{ marginLeft: 20, marginTop: 23 }}
                            >
                                Reset
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
}