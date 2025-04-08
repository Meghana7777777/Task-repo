
import { GetAllAttributeDto, AttributeIdReqDto, AlertMessages ,GetAllAttributeDto as GetAllAttributesDto} from '@hrexpert/shared-models';
import { AttributeService } from '@hrexpert/shared-services';
import { Table } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';
import TableActions from '../../../common/table-actions/table-actions';



interface IAttributeGridProps {
    attributeData: GetAllAttributesDto[];
    setInitialValues: Dispatch<SetStateAction<GetAllAttributeDto>>;
    createButtonHandler: () => void;
    getAllAttributes: () => void;
}

export const AttributeGrid = (props: IAttributeGridProps) => {
    const { attributeData, setInitialValues, createButtonHandler, getAllAttributes } = props;
    const attributeService = new AttributeService();
        const { IAMClientAuthContext } = useIAMClientState();
    const { t } = useTranslation();
    


    const updateStatus = (id: number) => {
        const req = new AttributeIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, id)
        attributeService.activateAndDeactivatedAttributes(req).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllAttributes();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => console.log(err.message));
    }

    const editOnClickHandler = (record: GetAllAttributesDto) => {
            setInitialValues(record);
            createButtonHandler();
    }


    const attributeColumns = [
        {
            title: t("attribute.common.attributeName", {defaultValue: 'Attribute Name'}),
            dataIndex: 'attributeName',
        }, 
        {
            title: t("attribute.grid.actions", {defaultValue: 'Actions'}),
            render: (value: any, record: GetAllAttributesDto) => {
                return <>
                    <TableActions record={record} editOnClickHandler={editOnClickHandler} statusUpdate={updateStatus} recordId={record.attributeId} />
                </>
            }

            // 

        },
    ]

    return (
        <div>

            <Table columns={attributeColumns}
             dataSource={attributeData} 
             size="small" 
        />
            {/* <EditOutlined onClick={handleClick}/> */}

        </div>
    )
}
