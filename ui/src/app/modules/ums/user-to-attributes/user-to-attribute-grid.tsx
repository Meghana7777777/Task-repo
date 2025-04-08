
import { EditOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { UserToAttributesModel } from './user-to-attribute-form';



interface IUserToAttributesGridProps {
    data: UserToAttributesModel[]
}

export const  UserToAttributessGrid = (props: IUserToAttributesGridProps) => {
    const { data } = props;
    const { t } = useTranslation();


    const UserToAttributesColumns = [
        {
            title: t("userToPermission.grid.name", { defaultValue: 'Name' }),
            dataIndex: 'name',
        },
        {
            title: t("userToPermission.grid.description", { defaultValue: 'Description' }),
            dataIndex: 'description'
        },
        {
            title: t("userToPermission.grid.actions", { defaultValue: 'Actions' }),
            key: 'actions',
            render: (value: any, record: any) => {
                return <>
                    <EditOutlined />
                </>
            }
        }

    ]
    return (
        <Table columns={UserToAttributesColumns} dataSource={data}  size='small' />
    )
}