import { CheckOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ModuleDto } from '@hrexpert/shared-models';
import { Divider, Popconfirm, Switch, Table, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';



interface IModuleGridProps {
    data: ModuleDto[];
    editHandler: (rec: ModuleDto) => void
    activateOrDeactivate: (rec: ModuleDto) => void
}

export const ModuleGrid = (props: IModuleGridProps) => {
    const { t } = useTranslation();
        const { IAMClientAuthContext } = useIAMClientState();
    const { data, editHandler, activateOrDeactivate } = props;

    const moduleColumns = [
        {
            title: t("module.common.moduleName", {defaultValue: 'Module Name'}),
            dataIndex: 'moduleName',
        },
        {
            title: t("module.common.description", {defaultValue: 'Description'}),
            dataIndex: 'moduleDescription'
        },
        {
            title: t("module.common.applicationId", {defaultValue: 'Application ID'}),
            dataIndex: 'application',
        },
        {
            title: t("module.grid.actions", {defaultValue: 'Actions'}),
            Width: '100px',
            render: (text: string, rowData: ModuleDto) => (
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
                        title={rowData.isActive ? t("common.deActivateConfirmMsg", { defaultValue: 'Are you sure to Deactivate Record ?' }) : t("common.activateConfirmMsg", { defaultValue: 'Are you sure to activate Record ?' })}>
                        <Tooltip placement="top" title={rowData.isActive ? t("common.deActivate", { defaultValue: 'Deactivate' }) : t("common.activate", { defaultValue: 'Activate' })}>
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
        <Table columns={moduleColumns}
         dataSource={data} 
           size='small'
        
        />
    )
}