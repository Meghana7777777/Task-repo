
import { GetAllApplicationsDto, ApplicationIdReqDto, AlertMessages } from '@hrexpert/shared-models';
import { ApplicationService } from '@hrexpert/shared-services';
import { Table } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { useIAMClientState } from '../../../common/iam-client-react';
import TableActions from '../../../common/table-actions/table-actions';
import { useTranslation } from 'react-i18next';





interface IApplicationGridProps {
    applicationData: GetAllApplicationsDto[];
    createButtonHandler: () => void;
    setInitialValues: Dispatch<SetStateAction<GetAllApplicationsDto>>;
    getAllApplicationsData: () => void;
}
export const ApplicationGrid = (props: IApplicationGridProps) => {
    const { applicationData } = props;
    const { t } = useTranslation();
    const { createButtonHandler, setInitialValues, getAllApplicationsData } = props;
    const service = new ApplicationService();
    const { IAMClientAuthContext } = useIAMClientState();


    const updateStatus = (id: number) => {
        const req = new ApplicationIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, id)
        service.activateOrDeactivate(req).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllApplicationsData();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => console.log(err.message));
    }
    const editOnClickHandler = (record: GetAllApplicationsDto) => {
        if (record.isActive) {
            setInitialValues(record);
            createButtonHandler();
        } else {
            AlertMessages.getErrorMessage('You Cannot Edit Deactivated Record');
        }
    }

    const applicationColumns = [
        {
            title: t("application.common.name", { defaultValue: 'Name' }),
            dataIndex: 'applicationName',
        },
        {
            title: t("application.common.name", { defaultValue: 'Description' }),
            dataIndex: 'description',
        },
        {
            title: t("application.grid.actions", { defaultValue: 'Actions' }),
            render: (value: any, record: GetAllApplicationsDto) => {
                return <>
                    <TableActions record={record} editOnClickHandler={editOnClickHandler} statusUpdate={updateStatus} recordId={record.applicationId} />
                </>
            }

            // 

        },
    ];
    return <Table columns={applicationColumns} 
    dataSource={applicationData}
    size='small' />;
};
