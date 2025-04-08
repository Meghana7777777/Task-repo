import { EditOutlined, RightSquareOutlined } from '@ant-design/icons';
import { AlertMessages } from '@hrexpert/shared-models';
import { Popconfirm, Switch } from 'antd'; 


interface IProps {
    record: any;
    editOnClickHandler: (record: any) => void;
    statusUpdate: (id: number) => void;
    recordId: number;
}
const TableActions = (props: IProps) => {
    const { record, statusUpdate, editOnClickHandler, recordId } = props;

    const confirm = () => {
        statusUpdate(recordId);
    };



    return <>
        <EditOutlined onClick={() => {
            if (record.isActive) {
                editOnClickHandler(record);
            } else {
                AlertMessages.getErrorMessage('You Cannot Edit Deactivated Record');
            };
        }}
            style={{ color: '#1890ff', fontSize: '24px' }} />
        <Popconfirm
            title={`Are You Sure To ${record.isActive ? 'Deactivate ?' : 'Activate ?'}`}
            onConfirm={confirm}
            okText="Yes"
            cancelText="No"
        >
            <Switch
                size='default'
                checkedChildren={<RightSquareOutlined type="check" />}
                unCheckedChildren={<RightSquareOutlined type="close" />}
                defaultChecked={true}
                className={`${record.isActive ? 'toggle-activated' : 'toggle-deactivated'}`}
                checked={record.isActive}
            />

        </Popconfirm>

    </>
}

export default TableActions