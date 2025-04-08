import { CheckOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { SubMenuDto } from '@hrexpert/shared-models';
import { Divider, Popconfirm, Switch, Table, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';



interface ISubMenuGridProps {
    subMenuData: SubMenuDto[];
    editHandler: (rec: SubMenuDto) => void
    activateOrDeactivate: (rec: SubMenuDto) => void
}
export const  SubMenuGrid = (props: ISubMenuGridProps) => {
    const { t } = useTranslation();
    const { IAMClientAuthContext } = useIAMClientState();
    const { subMenuData, editHandler, activateOrDeactivate } = props;
    const column = [
        {
            title: t("submenus.common.name", { defaultValue: 'Name' }),
            dataIndex: 'name',
        },
        {
            title: t("submenus.common.order", { defaultValue: 'Order' }),
            dataIndex: 'order',
        },
        {
            title: t("submenus.common.iconType", { defaultValue: 'Icon Type' }),
            dataIndex: 'iconType',
        },
        {
            title: t("submenus.common.iconName", { defaultValue: 'Icon Name' }),
            dataIndex: 'iconName',
        },
        // {
        //     title: 'Icon Name',
        //     dataIndex: 'iconName',
        // },
        {
            title: t("submenus.common.path", { defaultValue: 'Path' }),
            dataIndex: 'path',
        },
        {
            title: t("submenus.common.component", { defaultValue: 'Component' }),
            dataIndex: 'component',
        },
        {
            title: t("submenus.common.parentId", { defaultValue: 'ParentID' }),
            dataIndex: 'parentId',
        },
        {
            title: t("submenus.grid.menu", { defaultValue: 'Menu' }),
            dataIndex: 'menuName',
        },
        {
            title: t("submenus.grid.actions", { defaultValue: 'Actions' }),
            dataIndex: 'actions',
            render: (text: string, rowData: SubMenuDto) => (
                <span>
                    <EditOutlined className={'editSamplTypeIcon'} type="edit"
                        onClick={() => {
                            editHandler(rowData);
                        }}
                        style={{ color: '#1890ff', fontSize: '20px' }}
                    />
                    <Divider type="vertical" />
                    <Popconfirm
                        onConfirm={e => {
                            activateOrDeactivate(rowData);
                        }}
                        title={rowData.isActive ? t("common.deActivateConfirmMsg", { defaultMessage: 'Are you sure to Deactivate Record ?' }) : t("common.activateConfirmMsg", { defaultMessage: 'Are you sure to activate Record ?' })}>
                        <Tooltip placement="top" title={rowData.isActive ? t("common.deActivate", { defaultMessage: 'Deactivate' }) : t("common.activate", { defaultMessage: 'Activate' })}>
                            <Switch size='default'
                                className={rowData.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseCircleOutlined />}
                                checked={rowData.isActive} />
                        </Tooltip>
                    </Popconfirm>
                </span>
            )
        }
    ]
    return (
        <div>

            <Table columns={column} dataSource={subMenuData} size='small'  />

        </div>
    )
}

