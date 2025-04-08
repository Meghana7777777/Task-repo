import { EditOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { UserPFormModel } from './user-permission-form';





interface IUserPFormProps {
    userPData: UserPFormModel[]
}
export const  UserPGrid = (props: IUserPFormProps) => {
    const { userPData } = props;
    const { t } = useTranslation();

    const column = [
        {
            title: t("userPermissions.grid.sno", { defaultValue: 'S.No' }),
            dataindex: 'sno',
        },
        {
            title: t("userPermissions.common.permissionId", { defaultValue: 'Permission ID' }),
            dataindex: 'permissionId',
        },
        {
            title: t("userPermissions.common.userId", { defaultValue: 'User ID' }),
            dataindex: 'userId',
        },
        {
            title: t("userPermissions.grid.actions", { defaultValue: 'Actions' }),
            key: 'actions',
            render: (value: any, record: any) => {
                return <>
                    <EditOutlined />
                </>
            }
        }
    ]
    return (
        <div>

            <Table columns={column} dataSource={userPData}  size='small' />

        </div>
    )
}

