import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, MinusCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { LoanSalaryStatusEnum } from "@hrexpert/shared-models";
import { Tag } from "antd";
import React from "react";

interface IProps {
    status: LoanSalaryStatusEnum | string;
}

const StatusTag: React.FC<IProps> = (props) => {
    const { status } = props;

    const getTag = (status: LoanSalaryStatusEnum | string) => {
        switch (status) {
            case LoanSalaryStatusEnum.OPEN:
                return (
                    <Tag
                        icon={<SyncOutlined spin />}
                        color="processing"
                        style={{ fontSize: "10px" }}
                    >
                        {LoanSalaryStatusEnum.OPEN}
                    </Tag>
                );

            case LoanSalaryStatusEnum.APPROVED:
                return (
                    <Tag
                        icon={<CheckCircleOutlined />}
                        color="success"
                        style={{ fontSize: "10px" }}
                    >
                        {LoanSalaryStatusEnum.APPROVED}
                    </Tag>
                );

            case LoanSalaryStatusEnum.CANCEL:
                return (
                    <Tag
                        icon={<CloseCircleOutlined />}
                        color="warning"
                        style={{ fontSize: "10px" }}
                    >
                        {LoanSalaryStatusEnum.CANCEL}
                    </Tag>
                );

            case LoanSalaryStatusEnum.REJECTED:
                return (
                    <Tag
                        icon={<ExclamationCircleOutlined />}
                        color="error"
                        style={{ fontSize: "10px" }}
                    >
                        {LoanSalaryStatusEnum.REJECTED}
                    </Tag>
                );

            default:
                return (
                    <Tag
                        icon={<MinusCircleOutlined />}
                        color="default"
                        style={{ fontSize: "10px" }}
                    >
                        OPEN
                    </Tag>
                );
        }
    };

    return <>{getTag(status)}</>;
};

export default StatusTag;
