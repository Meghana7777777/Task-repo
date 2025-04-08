
import { GetAllScopesDto, ScopesIdDto, AlertMessages } from '@hrexpert/shared-models';
import { ScopesService } from '@hrexpert/shared-services';
import { Table } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';
import TableActions from '../../../common/table-actions/table-actions';



interface IScopeFormProps {
    scopeData: GetAllScopesDto[];
    setInitialValues: Dispatch<SetStateAction<GetAllScopesDto | undefined>>;
    createButtonHandler: () => void;
    getAllScopes: () => void;
}

export const  ScopeGrid = (props: IScopeFormProps) => {
    const { scopeData, setInitialValues, createButtonHandler, getAllScopes } = props;
    const scopesService = new ScopesService();
    const { IAMClientAuthContext } = useIAMClientState();
    const { t } = useTranslation();


    const statusUpdate = (id: number) => {
        const req = new ScopesIdDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, id);
        scopesService.activateAndDeactivatedScope(req).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllScopes();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            };
        }).catch(err => console.log(err.message, 'err message'))
    };

    const editOnClickHandler = (record: GetAllScopesDto) => {
        setInitialValues(record);
        createButtonHandler();
    }

    const scopeColumn = [
        {
            title: t("scope.common.name", { defaultValue: 'Name' }),
            dataIndex: 'name',
        },
        {
            title: t("scope.common.code", { defaultValue: 'Code' }),
            dataIndex: 'code',
        },
        {
            title: t("scope.grid.actions", { defaultValue: 'Actions' }),
            key: 'actions',
            render: (value: any, record: GetAllScopesDto) => {
                return <>
                    <TableActions statusUpdate={statusUpdate} record={record} editOnClickHandler={editOnClickHandler} recordId={record.scopeId} />
                </>
            }
        }
    ]
    return (
        <div>

            <Table columns={scopeColumn} dataSource={scopeData} pagination={false}  size='small'/>

        </div>
    )
}

