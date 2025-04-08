import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, MinusCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { TourIntimationEnum } from "@hrexpert/shared-models";
import { Tag } from "antd";
import React from "react";

interface IProps {
    status: TourIntimationEnum | string;
}

const StatusTag: React.FC<IProps> = (props) => {
    const { status } = props;

    const getTag = (status: TourIntimationEnum | string) => {
        switch (status) {
            case TourIntimationEnum.OPEN:
                return (
                    <Tag
                        icon={<SyncOutlined spin />}
                        color="processing"
                        style={{ fontSize: "10px" }}
                    >
                        {TourIntimationEnum.OPEN}
                    </Tag>
                );

            case TourIntimationEnum.APPROVED:
                return (
                    <Tag
                        icon={<CheckCircleOutlined />}
                        color="success"
                        style={{ fontSize: "10px" }}
                    >
                        {TourIntimationEnum.APPROVED}
                    </Tag>
                );

            case TourIntimationEnum.CANCLE:
                return (
                    <Tag
                        icon={<CloseCircleOutlined />}
                        color="warning"
                        style={{ fontSize: "10px" }}
                    >
                        {TourIntimationEnum.CANCLE}
                    </Tag>
                );

            case TourIntimationEnum.REJECTED:
                return (
                    <Tag
                        icon={<ExclamationCircleOutlined />}
                        color="error"
                        style={{ fontSize: "10px" }}
                    >
                        {TourIntimationEnum.REJECTED}
                    </Tag>
                );

            default:
                return (
                    <Tag
                        icon={<MinusCircleOutlined />}
                        color="default"
                        style={{ fontSize: "10px" }}
                    >
                        Unknown
                    </Tag>
                );
        }
    };

    return <>{getTag(status)}</>;
};

export default StatusTag;
