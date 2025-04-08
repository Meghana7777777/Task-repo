
import { GetAllUsersDto, OrganizationReqDto, UsersIdDto, AlertMessages } from '@hrexpert/shared-models';
import { UsersService } from '@hrexpert/shared-services';
import { Input, Table } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';
import TableActions from '../../../common/table-actions/table-actions';


interface IUserGridProps {
    userData: GetAllUsersDto[]
    createButtonHandler: () => void;
    setInitialValues: Dispatch<SetStateAction<GetAllUsersDto>>;
    selectedClients: number;
    getUsersByOrganizationId: (orgIdReq: OrganizationReqDto) => void
}

export const  UserGrid = (props: IUserGridProps) => {
    const { userData, setInitialValues, createButtonHandler, selectedClients, getUsersByOrganizationId } = props;
    const { IAMClientAuthContext } = useIAMClientState();
    const userservice = new UsersService;
    const { t } = useTranslation();
    const orgIdReq: OrganizationReqDto = new OrganizationReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, selectedClients)
    const [searchedText, setSearchedText] = useState('');


    const updateStatus = (usersId: number) => {
        const req = new UsersIdDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, usersId)
        userservice.activateDeactivateUsers(req).then((res: any) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getUsersByOrganizationId(orgIdReq)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => console.log(err.message));
    }
    const editOnClickHandler = (record: GetAllUsersDto) => {
        if (record.isActive) {
            setInitialValues(record);
            createButtonHandler();
        } else {
            AlertMessages.getErrorMessage('You Cannot Edit Deactivated Record');
        }
    }

    const column = [
        {
            title: t('user.grid.firstName', { defaultValue: 'Employee Mail' }),
            dataIndex: 'firstName',
            filteredValue: [String(searchedText).toLowerCase()],
            onFilter: (value: { toLocaleString: () => string; }, record: { [x: string]: any; }) => {
                const aaa = new Set(Object.keys(record).map((key) => {
                    return String(record[key]).toLowerCase().includes(value.toLocaleString());
                }));
                if (aaa.size && aaa.has(true))
                    return true;
                else
                    return false;
            },
        },
        {
            title: t('user.common.employeeCode', { defaultValue: 'employeeCode' }),
            dataIndex: 'employeeCode',
        },
        // {
        //     title: t('user.Common.gender', { defaultValue: 'Gender' }),
        //     dataIndex: 'gender',
        // },
        // {
        //     title: t('user.Common.externalRefNo', { defaultValue: 'External Ref No' }),
        //     dataIndex: 'externalRefNo',
        // },
        {
            title: t('user.grid.actions', { defaultValue: 'Actions' }),
            key: 'actions',
            render: (value: any, record: GetAllUsersDto) => {
                return <>
                    <TableActions record={record} editOnClickHandler={editOnClickHandler} statusUpdate={updateStatus} recordId={record.userId} />
                </>
            }
        }
    ]
    return (
        <>
            <div style={{ float: 'right' }}>
                <Input.Search placeholder="Search here..." allowClear onChange={(e) => { setSearchedText(e.target.value) }} onSearch={(value) => { setSearchedText(value) }} style={{ width: 200, marginRight: '10px' }} />
            </div>
            <Table columns={column} dataSource={userData} scroll={{ y: 1000 }} pagination={false} size='small'  />
        </>
    )
}

