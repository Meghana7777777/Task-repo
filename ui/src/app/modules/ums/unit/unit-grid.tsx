
import { GetAllUnitDto, OrganizationReqDto, UnitIdDto, AlertMessages } from '@hrexpert/shared-models';
import { UnitsService } from '@hrexpert/shared-services';
import { Table } from 'antd';
import { Dispatch, SetStateAction } from 'react';

import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';
import TableActions from '../../../common/table-actions/table-actions';



interface IUnitFormProps {
    unitData: GetAllUnitDto[];
    setInitialValues: Dispatch<SetStateAction<GetAllUnitDto | undefined>>;
    createButtonHandler: () => void;
    selectedUnits: number
    getUnitsByClientId: (orgIdReq: OrganizationReqDto) => void
}

export const  UnitGrid = (props: IUnitFormProps) => {
    const { unitData, setInitialValues, createButtonHandler, getUnitsByClientId, selectedUnits } = props;
    const unitsService = new UnitsService();
    const { IAMClientAuthContext } = useIAMClientState();
    const { t } = useTranslation();
    const orgIdReq: OrganizationReqDto = new OrganizationReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, selectedUnits)


    const statusUpdate = (id: number) => {
        const req = new UnitIdDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, id);
        unitsService.activateAndDeactivatedUnit(req).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getUnitsByClientId(orgIdReq)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            };
        }).catch(err => console.log(err.message, 'err message'))
    };

    const editOnClickHandler = (record: GetAllUnitDto) => {
        if (record.isActive) {
            setInitialValues(record);
            createButtonHandler();
        } else {
            AlertMessages.getErrorMessage('You Cannot Edit Deactivated Record');
        }

    }

    const unitColumn = [
        {
            title: t("unit.common.name", { defaultValue: 'Name' }),
            dataIndex: 'name',
        },
        {
            title: t("unit.common.description", { defaultValue: 'Description' }),
            dataIndex: 'description',
        },
        {
            title: t("unit.common.organizationId", { defaultValue: 'OrganizationID' }),
            dataIndex: 'organization',
        },
        // {
        //     title: t("unit.grid.status", {defaultValue:'Status'}),
        //     dataIndex: 'status',
        // },
        {
            title: t("unit.grid.actions", { defaultValue: 'Actions' }),
            key: 'actions',
            render: (value: any, record: GetAllUnitDto) => {
                return <>
                    <TableActions statusUpdate={statusUpdate} record={record} editOnClickHandler={editOnClickHandler} recordId={record.unitId} />
                </>
            }
        }
    ]
    return (
        <div>

            <Table columns={unitColumn} dataSource={unitData} pagination={false} size='small'  />

        </div>
    )
}

