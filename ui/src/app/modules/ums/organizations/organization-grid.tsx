
import { GetAllOrganizations, OrganizationReqDto, AlertMessages } from '@hrexpert/shared-models';
import { OrganizationService } from '@hrexpert/shared-services';
import { Table } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';
import TableActions from '../../../common/table-actions/table-actions';


// import { ClientModel } from ;

interface IOrganizationGridProps {
    tableData: GetAllOrganizations[];
    setInitialValues: Dispatch<SetStateAction<GetAllOrganizations | undefined>>;
    createButtonHandler: () => void;
    getAllOrganizations: () => void;
}

export const  OrganizationGrid = (props: IOrganizationGridProps) => {
    const { tableData, setInitialValues, createButtonHandler, getAllOrganizations } = props;
    const orgService = new OrganizationService();
        const { IAMClientAuthContext } = useIAMClientState();
    const { t } = useTranslation();




    const statusUpdate = (id: number) => {
        const req = new OrganizationReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, id);
        orgService.activateOrDeactivateOrganization(req).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllOrganizations();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            };
        }).catch(err => console.log(err.message, 'err message'))
    };


    const editOnClickHandler = (record: GetAllOrganizations) => {
            setInitialValues(record);
            createButtonHandler();
    };

    const organizationColumns = [
        {
            title: t("organization.common.name", {defaultValue:'Name'}),
            dataIndex: 'name',
        },
        {
            title: t("organization.common.description", {defaultValue:'Description'}),
            dataIndex: 'description'
        },
        {
            title: t("organization.grid.actions", {defaultValue:'Actions'}),
            key: 'actions',
            render: (value: any, record: GetAllOrganizations) => {
                return <>
                    <TableActions statusUpdate={statusUpdate} record={record} editOnClickHandler={editOnClickHandler} recordId={record.organizationId}/>
                </>
            }
        }

    ]
    return (
        <Table columns={organizationColumns} 
        pagination={false} 
        dataSource={tableData} 
          size='small'
        
        />
    )
}
